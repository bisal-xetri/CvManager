import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { store } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import { initEmailJS } from "@/lib/emailjs";
import router from "@/routes";

function App() {
  useEffect(() => {
    // Initialize EmailJS
    initEmailJS();

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        store.dispatch(
          setUser({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
            photoURL: user.photoURL || undefined,
          })
        );
      } else {
        store.dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
