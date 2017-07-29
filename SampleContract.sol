pragma solidity ^0.4.0;

contract SampleContract {
 
 uint private _x = 0;
 uint private _y = 0;
 uint private _sum = 0;
 
 event EventForSetX(uint _x);                    
 event EventForSetY(uint _x);                    
 event EventForAddXY(uint _sum);                    

 function SampleContract() { 
 }   
 
 function setX(uint x) {
    _x = x;
    EventForSetX(_x);
 }
 
 function setY(uint y) {
    _y = y;
    EventForSetY(_y);
 }
 
 function AddXY() {
    _sum=_x+_y;
    EventForAddXY(_sum);
 }

 function getSum() constant returns(uint) {
     return _sum;
 }

}
