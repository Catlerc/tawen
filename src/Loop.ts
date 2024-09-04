import {EnergyCollectionActivity} from "./Activity/Activity";

class Loop {
  start(){
    console.log("starting...");
    EnergyCollectionActivity.kek()
  }
  update(){
    console.log("update...")
  }
}




export default new Loop()