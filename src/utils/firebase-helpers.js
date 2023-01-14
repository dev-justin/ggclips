import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore/lite";

// Get all docuemnt ids from the user collection
const checkUsername = async (username) => {
  const querySnapshot = await getDocs(collection(db, "usernames"));
  const usernamesDB = querySnapshot.docs.map((doc) => doc.id.toLowerCase());
  return usernamesDB.includes(username.toLowerCase());
};

// Get users details from /usernames collection and return data and doc.id
const getUserDetails = async (username) => {
  const docRef = doc(db, "usernames", username.toLowerCase());
  const docSnap = await getDoc(docRef);
  return { username: docSnap.id, ...docSnap.data() };
};

// Create a new user with email and password and save it to the database under users collection
const createUser = async (username, email, password) => {
  const allUsernames = await checkUsername(username);
  if (allUsernames) {
    throw { code: "auth/username-already-in-use" };
  }

  try {
    // Adding user to firebase auth
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Adding username and avatar to firebase auth
    await updateProfile(user, {
      displayName: username.toLowerCase(),
      photoURL: `https://api.dicebear.com/5.x/bottts-neutral/svg?seed=${username}&backgroundColor=7d7d7d,d74d4d,7e22ce,60a5fa,22d3ee`,
    });

    // Add username to usernames collection (public)
    await setDoc(doc(db, "usernames", username.toLowerCase()), {
      uid: user.uid,
      photoURL: user.photoURL,
    });

    // Add user to users collection (private)
    await setDoc(doc(db, "users", username.toLowerCase()), {
      username: username.toLowerCase(),
      email: user.email,
      uid: user.uid,
      createdAt: new Date(),
      photoURL: user.photoURL,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// Login a user with email and password
const loginUser = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    throw error;
  }
};

// Logout a user
const logoutUser = async () => {
  try {
    await signOut(auth);
    window.location.reload();
  } catch (error) {
    throw error;
  }
};

// Create associated clips collection for clip uploads
const addClip = async (data) => {
  const docRef = await addDoc(collection(db, "clips"), {
    username: data.username.toLowerCase(),
    uid: data.uid,
    title: data.title,
    game: data.game,
    date: new Date(),
    url: data.url,
    size: data.size,
    avatar: data.avatar,
  });
  return docRef;
};

// Convert firebase timestamp to readable date
const convertDate = (date) => {
  const newDate = new Date(date.seconds * 1000);
  return newDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Get a specific clip by id
const getClip = async (id) => {
  const docRef = doc(db, "clips", id);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

// Get clips by user id
const getClipsByUsername = async (username) => {
  const q = query(
    collection(db, "clips"),
    where("username", "==", username.toLowerCase()),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

// Get the 5 most recent clips
const getRecentClips = async (max) => {
  const q = query(collection(db, "clips"), orderBy("date", "desc"), limit(max));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

const errorCodes = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "Email already in use";
    case "auth/invalid-email":
      return "Invalid email";
    case "auth/weak-password":
      return "Password is too weak";
    case "auth/user-not-found":
      return "User not found";
    case "storage/unauthorized":
      return "Issue uploading file. Please try again later.";
    case "auth/username-already-in-use":
      return "Username already in use";
    default:
      return "Something went wrong";
  }
};

export {
  createUser,
  loginUser,
  logoutUser,
  errorCodes,
  addClip,
  convertDate,
  getClip,
  getClipsByUsername,
  getUserDetails,
  getRecentClips,
};
