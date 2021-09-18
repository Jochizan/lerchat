import mongoose, { model, Schema } from 'mongoose';
import INamespace from '../interfaces/namespace';

mongoose.Promise = global.Promise;

const NamespaceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    server: { type: Schema.Types.ObjectId, required: true },
    state: { type: Boolean, default: true }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default mongoose.models.Namespaces ||
  model<INamespace>('Namespaces', NamespaceSchema);
