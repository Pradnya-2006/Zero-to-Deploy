export const EMISSION_FACTORS = {
  electricity: 0.75,

  transport: {
    car: {
      petrol: 0.2,
      diesel: 0.17,
      ev: 0.05,
    },
    public: {
      bus: 0.06,
      metro: 0.03,
      train: 0.025,
    },
    bike: 0.04,
    walk: 0,
  },
};
