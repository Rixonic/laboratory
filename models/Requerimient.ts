import mongoose, { Schema, model, Model } from 'mongoose';
import { IRequerimient } from '../interfaces';

const userSchema = new Schema({
    requerimientId: { type: String, required: true },
    severity:       { type: String, required: true },
    expectedMonth:  { type: String, required: true },
    service:        { type: String, required: true },
    destination:    { type: String, required: true },
    comment:        { type: String, default: "" },
    createdBy:      { type: String, required: true },
    isSigned:       { type: Boolean, required: true,default: false },
    items: [{ 
        item:       { type: String, required: true },
        quantity:   { type: Number, required: true },
        type:       { type: String, required: true },
        description:{ type: String, required: true },
        brand:      { type: String, },
        model:      { type: String, },
        reason:     { type: String, },
    }],
}, {
    timestamps: true,
})

const Requerimient:Model<IRequerimient> = mongoose.models.Requerimient || model('Requerimient',userSchema);

export default Requerimient;