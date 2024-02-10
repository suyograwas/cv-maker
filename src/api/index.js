// import {auth} from "../config/firebase.config";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { toast } from "react-toastify";

export const getUserDetail = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const userData = userCred.providerData[0];
        const unsubscribe = onSnapshot(
          doc(db, "users", userData?.uid),
          (_doc) => {
            if (_doc.exists()) {
              resolve(_doc.data());
            } else {
              setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                resolve(userData);
              });
            }
          }
        );
        return unsubscribe;
      } else {
        reject(new Error("user is not authenticated"));
      }
      //make sure to unsubscribe from the listener to prevent the memory links
      unsubscribe();
    });
  });
};

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templatesQuery = query(
      collection(db, "templates"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(templatesQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });
    return unsubscribe;
  });
};

export const saveToCollections = async (user, data) => {
  if (!user?.collections?.includes(data?._id)) {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, { collections: arrayUnion(data?._id) })
      .then(() => {
        toast.success("Saved To Collection");
      })
      .catch((error) => {
        toast.error(`Error : ${error.message}`);
      });
  } else {
    const docRef = doc(db, "users", user?.uid);
    await updateDoc(docRef, { collections: arrayRemove(data?._id) })
      .then(() => {
        toast.success("Remove From Collection");
      })
      .catch((error) => {
        toast.error(`Error : ${error.message}`);
      });
  }
};

export const saveToFavourites = async (user, data) => {
  if (!data?.favourites?.includes(user?.uid)) {
    const docRef = doc(db, "templates", data?._id);

    await updateDoc(docRef, { favourites: arrayUnion(user?.uid) })
      .then(() => {
        toast.success("Added To Favourites");
      })
      .catch((error) => {
        toast.error(`Error : ${error.message}`);
      });
  } else {
    const docRef = doc(db, "templates", data?._id);

    await updateDoc(docRef, { favourites: arrayRemove(user?.uid) })
      .then(() => {
        toast.success("Remove From Favourites");
      })
      .catch((error) => {
        toast.error(`Error : ${error.message}`);
      });
  }
};

export const getTemplateDetails = async (templateId) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(doc(db, "templates", templateId), (doc) => {
      resolve(doc.data());
    });
    return unsubscribe;
  });
};

export const getTemplateDetailEditByUser = (uid, id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      doc(db, "users", uid, "resumes", id),
      (doc) => {
        resolve(doc.data());
      }
    );

    return unsubscribe;
  });
};

export const getSavedResumes = (uid) => {
  return new Promise((resolve, reject) => {
    const templatesQuery = query(
      collection(db, "users", uid, "resumes"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(templatesQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });
    return unsubscribe;
  });
};
