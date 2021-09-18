import mongoose, { Schema } from 'mongoose';

mongoose.Promise = global.Promise;

const UserSchema: Schema = new Schema(
  {
    names: { type: String, required: true, maxlength: 30 },
    username: { type: String, required: false, maxlength: 30 },
    surnames: { type: String, required: true, maxlength: 30 },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      maxlength: 36
    },
    password: { type: String, required: true, maxlength: 30 },
    state: { type: Boolean, default: true },
    birthday: { type: Date, required: false },
    image: { type: String, required: false, maxlength: 36 },
    organization: { type: String, required: false, maxlength: 36 },
    location: { type: String, required: false, maxlength: 36 },
    website: { type: String, required: false, maxlength: 36 },
    linkedin: { type: String, required: false, maxlength: 36 },
    biography: { type: String, required: false, maxlength: 512 },
    servers: [{ type: Schema.Types.ObjectId, required: false }]
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default UserSchema;
