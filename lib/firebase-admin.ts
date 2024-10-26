import { cert } from 'firebase-admin/app';
import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: cert({
      projectId: "matrimony-45d7f",
      clientEmail: "firebase-adminsdk-jrknj@matrimony-45d7f.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCsH60BaJq+Hnup\nV8DDjEaSRiGpUyO9wXsF0Bknjf/PkDkdJMUQMrYGdRL230iWZCoauVSikoQiCPCw\nUgZivFld3vRfPGeQWcfen+eXxAg5LforrveL3BdMoJeA9G8UuScauYIAul2nvSVz\nEpuGGibi1mZhBaeGH+Fk7vwzJpeqC2XOsN97sX3DTbUcucyetUMz4tabC9VMluv/\no6Oo2K0TSI4hmTz1BkFH9BNvO3tM9e95XaCyp3ZWPt/bK6Oc1JOG+T4jbwnXqn8Q\njjfoWEzl+Uh+I+GPqPsdr7yokkdH4HbbTuSdvZ3naHEiXZ4Yy8XnCVx2BTgvNYwo\n8eh9R705AgMBAAECggEASnx2uPpUpNu6NiF0mOs2iwxwer8w42g8XdqdWCG6R0+p\nd7Q213iqjwbRCya7WeHE2sXDG4t+ROBLkHIes1HA9r+KT0BrrOs9dFkMtv+tc1kz\nPv47wDmhl5aTmcmt3HD3vDf1S21bJEDVWQP/a7wbgeS4b1osEf3v42cMmvIjhgEs\nCHm1q9sd7vQ5oGQ0c88qFTQ8BrN5cRUIZks6yj7+5ctUl7ek9IVZHrAvWt0v5kr+\njOehR2whrfVh0/+9cwiqxCXdcxgrVCubuDGPQA8jjmlzhZcwLw0JKlOOeOvzOVK+\nRCycQ7a2VpI6I0vPMftgMAk3dacDHIS9V1hbJn8mFQKBgQDoz73YaaKDIANTvSqz\n2nknjtrt+CRM/3DSD/D90KYB+s3KTcx3KEGZwgmisKh1tR1curNHBDF9da4la1lT\nktttG/QugVRdKSu4Q/iEkIiIxSN79RM3QLq/GTgSW9M9sWLf/rZJ6xLT3qpyZLG+\n3HFZewogIfFvTWMzUXBtw1ZeZwKBgQC9RIJ78LdzgHS35UK+P7YjUFdysBsLliRG\nC7gpiVzSGdcqYHLIF1L8tvaCJ/Qc4IvU3VqU51wsb4azp4u/pPdD7WIuju0mch4f\nO75MM2weBJv51sSFGVjxi7Rlr2kvbvR0JYf7ikPL7VnJJV44x8MVgt3QrgfqwPLV\nqMKntzSDXwKBgQCeuv0aLzOhKVN7ZY9W3s8Z3HmCJFxDrymx3zKVKwv0b5adpxuP\n5n+LoNNG/CFvV5P0ZErVUZOYkYKxepaFt6wpoRSEHKNzfR2U3ar0X0Ln1VlTK431\nbwmkP0KOqdLFzkq2pAiPL1o/4CHgKq1RjyUtOAl4TQw6sc2/8HeyLquVYwKBgQCM\nc9zJEPdydS8okK+Y8zq8thBPAbTwQjkk6el+mXsSRy7POce0COsCstv39qJHE7Nx\nAdsIiTBzoUe65mjkjQ0ZkX28wz/lueX0k6dCcR6YoB8HpoMrqoXAqkXy99r84j/y\nOS/SUObC3J42kM59IHD686ScCanCYfFS8OuS/nevzQKBgQCWAl8zAc/bISNHAzsd\npIzAefWCkHodPf2MxUq73tJEXRu7fEMKbmGp2huX1+1wFN0vJiBEOgXrzTvQhkgJ\nyHpRPNEySloQynpF+MRAq3ZhfvalaEjWdsToGSeekVWKPsB9R5VNO9M4VNXU5WuE\nV/3MWRCBzDSUyo6SQ1X4jRIkNA==\n-----END PRIVATE KEY-----\n"?.replace(/\\n/g, '\n'),
 
    }),
    storageBucket: "matrimony-45d7f.appspot.com",
  });
}

export const adminAuth = admin.auth()
export const adminStorage = admin.storage()