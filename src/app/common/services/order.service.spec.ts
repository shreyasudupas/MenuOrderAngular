import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OrderDisplayModel, OrderModel } from 'src/app/user/components/order-details/order-model';
import { environment } from 'src/environments/environment';
import { OrderService } from './order.service';

describe('OrderService',()=>{
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;
    let service:OrderService;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        service = TestBed.inject(OrderService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('should return the updated order',() => {

        const sendData : OrderModel = {
            cartId:'testId',
            createdDate:'',
            currentOrderStatus: '',
            id:'',
            menuItems:[ {category:'',discount:0,foodType:'',image: {imageFileName:'',imageId:''},itemName:'Test',menuId:'1221',price:12,quantity:1,vendorId:'test VendorID'}],
            orderCancelledReason:null,
            paymentDetail: {methodOfDelivery:'',paymentSuccess:true,price:12,selectedPayment:''},
            totalPrice:12,
            status: {orderCancelled:'',orderDone:'',orderInProgress:'',orderPlaced:'',orderReady:''},
            uiOrderNumber:1,
            userDetail: {area:'',city:'',emailId:'',fullAddress:'',latitude:12,longitude:0,phoneNumber:'1223'},
            vendorDetail: { vendorId:'test vendorId',vendorName:'test name'}
        };

        const outpuData : OrderModel = {
            cartId:'testId',
            createdDate:'',
            currentOrderStatus: '',
            id:'',
            menuItems:[ {category:'',discount:0,foodType:'',image: {imageFileName:'',imageId:''},itemName:'Test',menuId:'1221',price:12,quantity:1,vendorId:'test VendorID'}],
            orderCancelledReason:null,
            paymentDetail: {methodOfDelivery:'',paymentSuccess:true,price:12,selectedPayment:''},
            totalPrice:12,
            status: {orderCancelled:'',orderDone:'',orderInProgress:'',orderPlaced:'',orderReady:''},
            uiOrderNumber:1,
            userDetail: {area:'',city:'',emailId:'',fullAddress:'',latitude:12,longitude:0,phoneNumber:'1223'},
            vendorDetail: { vendorId:'test vendorId',vendorName:'test name'}
        };

        const expectedData = {
            orderInfo: outpuData
        }

        service.updateOrderInformation(sendData).subscribe();

        const req = httpTestingController.expectOne(environment.orderService.order);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(expectedData);

        req.flush(expectedData);

    });

    it('it should return OrderDisplayModel',()=> {
        const datePlacedOrderInProgress = Date.now().toLocaleString();
        const sendData : OrderModel = {
            cartId:'testId',
            createdDate:'',
            currentOrderStatus: 'OrderInProgress',
            id:'',
            menuItems:[ {category:'',discount:0,foodType:'',image: {imageFileName:'',imageId:''},itemName:'Test',menuId:'1221',price:12,quantity:1,vendorId:'test VendorID'}],
            orderCancelledReason:null,
            paymentDetail: {methodOfDelivery:'',paymentSuccess:true,price:12,selectedPayment:''},
            totalPrice:12,
            status: {orderCancelled:null,orderDone:null,orderInProgress:datePlacedOrderInProgress,orderPlaced:null,orderReady:null},
            uiOrderNumber:1,
            userDetail: {area:'',city:'',emailId:'',fullAddress:'',latitude:12,longitude:0,phoneNumber:'1223'},
            vendorDetail: { vendorId:'test vendorId',vendorName:'test name'}
        };

        const expected: OrderDisplayModel = {
            cartId:'testId',
            createdDate:'',
            currentOrderStatus: 'OrderInProgress',
            id:'',
            menuItems:[ {category:'',discount:0,foodType:'',image: {imageFileName:'',imageId:''},itemName:'Test',menuId:'1221',price:12,quantity:1,vendorId:'test VendorID'}],
            orderCancelledReason:null,
            paymentDetail: {methodOfDelivery:'',paymentSuccess:true,price:12,selectedPayment:''},
            totalPrice:12,
            status: {orderCancelled:null,orderDone:null,orderInProgress:datePlacedOrderInProgress,orderPlaced:null,orderReady:null},
            uiOrderNumber:1,
            userDetail: {area:'',city:'',emailId:'',fullAddress:'',latitude:12,longitude:0,phoneNumber:'1223'},
            vendorDetail: { vendorId:'test vendorId',vendorName:'test name'},
            counter:null,
            isFastCancelButton:null,
            currentStatusDate:datePlacedOrderInProgress
        };

        var result = service.getOrderDisplayModel(sendData);

        expect(result).toEqual(expected);
    });

})