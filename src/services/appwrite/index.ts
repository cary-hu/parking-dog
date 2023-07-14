// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Client, Databases, ID, Query } from 'appwrite'
import { ParkingDogDataBaseID } from './constraint'

const client = new Client()
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('64b0ff633eaf807580c0')

const databases = new Databases(client)
export class AppWriteDatabase {
  public static createEntity(collectionID: string, data: object) {
    const uuid = ID.unique()
    const promise = databases.createDocument(ParkingDogDataBaseID, collectionID, uuid, data)
    promise.then((response) => {
      console.log(response) // Success
    }, (error) => {
      console.log(error) // Failure
    })
  }

  public static getAllEntity(collectionID: string) {
    const promise = databases.listDocuments(ParkingDogDataBaseID, collectionID, [
      Query.equal('title', 'Avatar'),
    ])

    promise.then((response) => {
      console.log(response) // Success
    }, (error) => {
      console.log(error) // Failure
    })
  }

  public static deleteEntity(collectionID: string, documentId: string) {
    const promise = databases.deleteDocument(ParkingDogDataBaseID, collectionID, documentId)

    promise.then((response: any) => {
      console.log(response) // Success
    }, (error) => {
      console.log(error) // Failure
    })
  }

  public static updateEntity(collectionID: string, documentId: string, data: object) {
    const promise = databases.updateDocument(ParkingDogDataBaseID, collectionID, documentId, data)

    promise.then((response) => {
      console.log(response) // Success
    }, (error) => {
      console.log(error) // Failure
    })
  }

  public static getEntity(collectionID: string, documentId: string) {
    const promise = databases.getDocument(ParkingDogDataBaseID, collectionID, documentId)

    promise.then((response) => {
      console.log(response) // Success
    }, (error) => {
      console.log(error) // Failure
    })
  }
}
