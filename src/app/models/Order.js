// models/User.js
import { strict } from 'assert';
import mongoose from 'mongoose';

const OrderMo = new mongoose.Schema({
  
},{strict:false});

export default mongoose.models.OrderMo || mongoose.model('Order', OrderMo);