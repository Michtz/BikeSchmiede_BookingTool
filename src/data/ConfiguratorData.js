export const dummyBikeData = {
  basePrice: 2999.0,
  defaultImage: '/assets/pantani-news-modified.jpg',
  groups: [
    {
      id: 'frame-color',
      title: 'Rahmenfarbe',
      items: [
        {
          id: 'color-black',
          name: 'Matt Schwarz (Standard)',
          price: 0,
          image: '/assets/bikes/black.jpg',
        },
        {
          id: 'color-red',
          name: 'Racing Rot',
          price: 150.0,
          image: '/assets/bikes/red.jpg',
        },
        {
          id: 'color-white',
          name: 'Perlmutt Weiß',
          price: 150.0,
          image: '/assets/bikes/white.jpg',
        },
      ],
    },
    {
      id: 'groupset',
      title: 'Schaltgruppe',
      items: [
        {
          id: 'shimano-105',
          name: 'Shimano 105 Di2',
          price: 0,
        },
        {
          id: 'shimano-ultegra',
          name: 'Shimano Ultegra Di2',
          price: 850.0,
        },
        {
          id: 'shimano-dura-ace',
          name: 'Shimano Dura-Ace Di2',
          price: 2100.0,
        },
      ],
    },
    {
      id: 'wheels',
      title: 'Laufradsatz',
      items: [
        {
          id: 'wheels-alloy',
          name: 'DT Swiss P1800 Spline (Alu)',
          price: 0,
        },
        {
          id: 'wheels-carbon-45',
          name: 'Schmolke Carbon TLO 45mm',
          price: 1200.0,
        },
        {
          id: 'wheels-carbon-60',
          name: 'Schmolke Carbon TLO 60mm',
          price: 1400.0,
        },
      ],
    },
    {
      id: 'handlebars',
      title: 'Lenker',
      items: [
        {
          id: 'handlebar-std',
          name: 'Standard Alu Lenker',
          price: 0,
        },
        {
          id: 'handlebar-carbon-aero',
          name: 'Carbon Aero Cockpit',
          price: 350.0,
        },
      ],
    },
    {
      id: 'saddle',
      title: 'Sattel',
      items: [
        {
          id: 'saddle-std',
          name: 'Selle Italia Model X',
          price: 0,
        },
        {
          id: 'saddle-fizik',
          name: 'Fizik Antares R3',
          price: 120.0,
        },
      ],
    },
  ],
};
