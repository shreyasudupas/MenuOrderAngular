import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as Leaflet from 'leaflet'; 
import { Vendor } from 'src/app/admin/components/vendor/vendor';

@Component({
    selector: 'vendor-map[latitude][longitude]',
    templateUrl: './vendor-map.component.html',
    styleUrls: [ './vendor-map.component.scss' ]
})

export class VendorMapComponent implements OnInit,OnDestroy {
    @Input() 
    latitude!:number;

    @Input() 
    longitude!:number;

    @Input() 
    vendors?:Vendor[];

    @Input()
    userMarkerRequired?:boolean;

    @Input()
    customAddressMarkerRequired?:boolean;

    @Output()
    customAddressLatLongValues? = new EventEmitter<any>();

    
    map!: Leaflet.Map;
    mapOptions: Leaflet.MapOptions;
    markers: Leaflet.Marker[] = [];
    customMarker: Leaflet.Marker;

    ngOnInit(): void {
        this.initMapOptions(this.latitude,this.longitude);
    }

    onMapReady(map: Leaflet.Map) {
        this.map = map;

        if(this.vendors !== undefined){
            this.initVendorMarkers();
        }

        if(this.userMarkerRequired !== undefined){
            if(this.userMarkerRequired === true){
                this.userMarker(this.latitude,this.longitude);
            }
        }

        if(this.customAddressMarkerRequired !== undefined){
            if(this.customAddressMarkerRequired == true){
                this.initCustomAddressMarker(this.latitude,this.longitude);
            }
        }

        if(this.customMarker !== undefined) {
            this.customMarker.on('dragend',(event:any)=> {
                var position = this.customMarker.getLatLng();
                
                //console.log('Dragged Position ',position);
                this.customAddressLatLongValues.emit({
                    latitude: position.lat,
                    longitude: position.lng
                });

            });
        }
    }

    initMapOptions(lat:number,longitude:number) {
        this.mapOptions = {
            center: Leaflet.latLng(lat,longitude),
            zoom: 15,
            minZoom:14,
            maxZoom:18,
            layers: [
                Leaflet.tileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        maxZoom: 18,
                        attribution: 'Map data © OpenStreetMap contributors'
                    }
                )
            ]
        };    
    }

    initVendorMarkers() {
        this.vendors.forEach((vendor ,index)=> {
            const data = {
                position: { lat: vendor.coordinates.latitude, lng: vendor.coordinates.longitude },
                draggable: false
            }
            const marker = Leaflet.marker(data.position,{ draggable: data.draggable });

            marker.addTo(this.map)
                                .bindPopup(vendor.vendorName);

            //tool tip creation

            const tooltip = Leaflet.tooltip({
                permanent: true,
                content: '<b>' +  vendor.vendorName + '</b>'
            });

            marker.bindTooltip(tooltip);

            this.markers.push(marker);
        });
    }

    userMarker(latitude:number,longitude:number) {
        const data = {
            postion: { lat: latitude , lng: longitude },
            draggable: false
        };

        const userMarker = Leaflet.marker(data.postion,{ 
            draggable: data.draggable,
            icon: Leaflet.icon({ 
                iconUrl:'assets/icons/myLocation.png',
                iconSize: [40,40]
            }) 
        });

        userMarker.addTo(this.map).bindPopup('Your location');

        this.markers.push(userMarker);

        //add circle radius
        const circle = Leaflet.circle([latitude,longitude],{
            color: 'blue',
            fillColor: '#7086FF',
            fillOpacity: 0.5,
            radius: 1100
        });

        circle.addTo(this.map);
    }

    initCustomAddressMarker(latitude:number,longitude:number) {
        const data = {
            postion: { lat: latitude , lng: longitude },
            draggable: true
        };

        this.customMarker = Leaflet.marker(data.postion,{ 
            draggable: data.draggable,
            icon: Leaflet.icon({ 
                iconUrl:'assets/icons/myLocation.png',
                iconSize: [40,40]
            }) 
        });

        this.customMarker.addTo(this.map);
    }

    ngOnDestroy(): void {
        console.log('Vendor map component Destroyed');
    }
}