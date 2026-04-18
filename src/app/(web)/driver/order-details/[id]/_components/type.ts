// interface Package {
//   packageNumber: string
//   barcodeImages: string[] // Array of image URLs/strings
// }

// interface Store {
//   store: string
//   numberOfPackages: number
//   packages: Package[]
// }

// interface JobData {
//   _id: string
//   status: string
//   customer: {
//     firstName: string
//     lastName: string
//     phone: string
//     pickupLocation: {
//       address: string
//     }
//   }
//   stores: Store[]
//   options: {
//     message: {
//       note: string
//     }
//     returnShippingLabel: {
//       dimensions: {
//         weight: number
//       }
//     }
//   }
// }