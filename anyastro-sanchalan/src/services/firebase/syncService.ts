import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import { getAllCustomers, getAllWork, getAllMoneyRecords } from "../local/dbService";

// Standard internet connection keys. 
// You must replace these empty strings with your real AnyAstro Firebase project keys before building for production.
const firebaseConfig = {
  apiKey: "AIzaSyA-WtE0RtEkcxWxxG__L8GXWF8o2fcxw2U",
  authDomain: "aatsanchalan.firebaseapp.com",
  projectId: "aatsanchalan",
  storageBucket: "aatsanchalan.firebasestorage.app",
  messagingSenderId: "58447936207",
  appId: "1:58447936207:web:9207ce62392771ca2415ba"
};

const app = initializeApp(firebaseConfig);
const internetDatabase = getFirestore(app);

export async function syncLocalRecordsToInternet(): Promise<string> {
  // Check if the computer has an active internet connection first
  if (!navigator.onLine) {
    throw new Error("No internet connection available. Cannot send records.");
  }

  try {
    // 1. Get all secure local records from the computer
    const customers = await getAllCustomers();
    const workRecords = await getAllWork();
    const moneyRecords = await getAllMoneyRecords();

    // 2. Prepare the internet cloud package
    const batchUpdate = writeBatch(internetDatabase);

    // 3. Package Customers safely
    customers.forEach((customer: any) => {
      const customerRef = doc(collection(internetDatabase, "customers"), customer.id.toString());
      batchUpdate.set(customerRef, customer);
    });

    // 4. Package Work projects safely
    workRecords.forEach((work: any) => {
      const workRef = doc(collection(internetDatabase, "work_projects"), work.id.toString());
      batchUpdate.set(workRef, work);
    });

    // 5. Package Money records safely
    moneyRecords.forEach((money: any) => {
      const moneyRef = doc(collection(internetDatabase, "money_records"), money.id.toString());
      batchUpdate.set(moneyRef, money);
    });

    // 6. Send the complete package securely to the internet
    await batchUpdate.commit();

    return "Internet cloud sync completed successfully.";
  } catch (error) {
    throw new Error("Internet sync failed. Please check your connection and safety rules.");
  }
}