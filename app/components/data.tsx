

//protectData
const protectedData = await dataProtectorCore.protectData({
    data: {
      email: 'example@gmail.com',
      SMTPserver: {
        port: 5000,
        smtp_server: 'smtp.gmail.com',
      },
    },
  });


//   Usage
const listProtectedData = await dataProtectorCore.getProtectedData({
  owner: '0xa0c15e...',
  requiredSchema: {
    email: 'string',
  },
});

import { type GetProtectedDataParams } from '@iexec/dataprotector';

const transferResponse = await dataProtectorCore.transferOwnership({
    protectedData: '0x123abc...',
    newOwner: '0xc5e9f4...',

  });

  import { type TransferParams } from '@iexec/dataprotector';

//   grantAccess
// Data encrypted through the Data Protector tool requires explicit authorization for runtime access. A newly created protectedData object has no inherent authorizations. This method grants permission to securely access the specified protectedData for processing using the processProtectedData method. Authorization to use the protectedData is given to a user in the context of an application (or a designated list of applications).


const grantedAccess = await dataProtectorCore.grantAccess({
  protectedData: '0x123abc...',
  authorizedApp: '0x456def...',
  authorizedUser: '0x789cba...',
  pricePerAccess: 3,
  numberOfAccess: 10,
  onStatusUpdate: ({ title, isDone }) => {
    console.log(title, isDone);
  },
});


// This method provides a listing of all access grants given for the specified protected data object. Options for filtering include specifying an authorized user, an authorized app, or both.
const listGrantedAccess = await dataProtectorCore.getGrantedAccess({
    protectedData: '0x123abc...',
    authorizedApp: '0x456def...',
    authorizedUser: '0x789cba...',
    page: 1,
    pageSize: 100,
  });

  const processProtectedDataResponse =
  await dataProtectorCore.processProtectedData({
    protectedData: '0x123abc...',
    app: '0x456def...',
    maxPrice: 10,
    args: 'arg1 arg2',
    inputFiles: ['https://example.com/file1', 'https://example.com/file2'],
    secrets: {
      1: 'secret1',
      2: 'secret2',
    },
  });

  const setForRentingResult =
  await dataProtectorSharing.setProtectedDataToRenting({
    protectedData: '0x123abc...',
    price: 1, // 1 nRLC
    duration: 60 * 60 * 24 * 30, // 30 days
  });

  const rentResult = await dataProtectorSharing.rentProtectedData({
    protectedData: '0x123abc...',
    price: 1, // 1 nRLC
    duration: 60 * 60 * 24 * 2, // 172,800 sec = 2 days
  });