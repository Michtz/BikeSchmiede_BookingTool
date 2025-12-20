export const dummyBikeData = {
  basePrice: 2999.0,
  defaultImage: '/assets/bikes/frame/odin_green_frame.png',
  groups: [
    {
      id: 'frame-type',
      title: 'Rahmen Type',
      items: [
        {
          id: 'color-white',
          name: 'Drift',
          price: 0,
          image: '/assets/bikes/frame/odin_white_frame.png',
        },
        {
          id: 'color-green',
          name: 'Flow',
          price: 150.0,
          image: '/assets/bikes/frame/odin_green_frame.png',
        },
        {
          id: 'color-yellow',
          name: 'Aero',
          price: 150.0,
          image: '/assets/bikes/frame/odin_yellow_frame.png',
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
          image: '/assets/bikes/frame/odin_white_frame_chain.png',
          price: 0,
        },
        {
          id: 'shimano-ultegra',
          name: 'Shimano Ultegra Di2',
          image: '/assets/bikes/frame/odin_white_frame_chain.png',
          price: 850.0,
        },
        {
          id: 'shimano-dura-ace',
          name: 'Shimano Dura-Ace Di2',
          image: '/assets/bikes/frame_chain/odin_white_frame_chain.png',
          price: 2100.0,
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
          image:
            '/assets/bikes/frame_chain_handlebar/odin_white_frame_chain_handlebar.png',
          price: 0,
        },
        {
          id: 'handlebar-carbon-aero',
          name: 'Carbon Aero Cockpit',
          image:
            '/assets/bikes/frame_chain_handlebar/odin_white_frame_chain_handlebar.png',
          price: 350.0,
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
          image: '/assets/bikes/complete/odin_white.png',
          price: 0,
        },
        {
          id: 'wheels-carbon-45',
          name: 'Schmolke Carbon TLO 45mm',
          image: '/assets/bikes/complete/odin_white_frame.png',
          price: 1200.0,
        },
        {
          id: 'wheels-carbon-60',
          name: 'Schmolke Carbon TLO 60mm',
          image: '/assets/bikes/complete/odin_white_frame.png',
          price: 1400.0,
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
          image: '/assets/bikes/complete/odin_white.png',
          price: 0,
        },
        {
          id: 'saddle-fizik',
          name: 'Fizik Antares R3',
          image: '/assets/bikes/complete/odin_white.png',
          price: 120.0,
        },
      ],
    },
  ],
};
