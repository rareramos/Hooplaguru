Countries = new Mongo.Collection('countries');

Countries.attachSchema(new SimpleSchema({
  cn_address_format: {
    type: String,
    optional: true,
  },
  cn_capital: {
    type: String,
    optional: true,
  },
  cn_currency_iso_3: {
    type: String,
    optional: true,
  },
  cn_currency_uid: {
    type: Number,
    optional: true,
  },
  cn_iso_2: {
    type: String,
    optional: true,
  },
  cn_iso_3: {
    type: String,
    optional: true,
  },
  cn_iso_nr: {
    type: Number,
    optional: true,
  },
   cn_official_name_en: {
    type: String,
    optional: true,
  },
   cn_official_name_local: {
    type: String,
    optional: true,
  },
   cn_phone: {
    type: Number,
    optional: true,
  },
   cn_short_en: {
    type: String,
    optional: true,
  },
  cn_short_local: {
    type: String,
    optional: true,
  },
  cn_tldomain: {
    type: String,
    optional: true,
  },
  cn_zone_flag: {
    type: Number,
    optional: true,
  },
  pid: {
    type: Number,
    optional: true,
  },
  uid: {
    type: Number,
    optional: true,
  },
}));


