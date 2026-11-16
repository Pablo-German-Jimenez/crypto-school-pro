import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { auth, isFirebaseConfigured, missingFirebaseEnv } from "../firebase.js";
import { useAuth } from "../contexts/auth.js";

const getLoginErrorMessage = (code) => {
  switch (code) {
    case "auth/invalid-email":
      return "El formato del correo electrónico no es válido.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "El correo o la contraseña no son correctos.";
    case "auth/user-disabled":
      return "Esta cuenta está deshabilitada. Contacta al administrador.";
    case "auth/too-many-requests":
      return "Hubo demasiados intentos. Espera un momento antes de volver a intentarlo.";
    case "auth/network-request-failed":
      return "No se pudo conectar con Firebase. Comprueba tu conexión e inténtalo otra vez.";
    case "auth/operation-not-allowed":
      return "Este método de acceso no está habilitado en Firebase.";
    case "auth/popup-closed-by-user":
      return "Se cerró la ventana de Google antes de completar el acceso.";
    case "auth/popup-blocked":
      return "El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo otra vez.";
    case "auth/cancelled-popup-request":
      return "Ya hay una solicitud de Google abierta. Completa esa ventana e inténtalo otra vez.";
    case "auth/unauthorized-domain":
      return "Este dominio no está autorizado en Firebase Authentication.";
    case "auth/account-exists-with-different-credential":
      return "Ya existe una cuenta con ese correo. Inicia sesión con el método que usaste originalmente.";
    default:
      return "No se pudo completar la solicitud. Inténtalo nuevamente.";
  }
};

const getFirebaseErrorCode = (error) =>
  error && typeof error === "object" && "code" in error ? error.code : "";

const passwordResetNotice =
  "Si existe una cuenta con ese correo, recibirás un enlace para restablecer la contraseña.";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busyAction, setBusyAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const { user, loading, authError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.from?.pathname || "/administrator";
  const busy = Boolean(busyAction);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setNotice("");

    if (!auth) {
      setErrorMessage("Firebase no está configurado. Completa las variables indicadas en el archivo .env.example.");
      return;
    }

    setBusyAction("email");
    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence,
      );
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(getFirebaseErrorCode(error)));
    } finally {
      setBusyAction("");
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    setNotice("");

    if (!auth) {
      setErrorMessage("Firebase no está configurado. Completa las variables indicadas en el archivo .env.example.");
      return;
    }

    setBusyAction("google");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence,
      );
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(getFirebaseErrorCode(error)));
    } finally {
      setBusyAction("");
    }
  };

  const handlePasswordReset = async () => {
    setErrorMessage("");
    setNotice("");

    if (!auth) {
      setErrorMessage("Firebase no está configurado. Completa las variables indicadas en el archivo .env.example.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Escribe tu correo electrónico para solicitar el restablecimiento.");
      return;
    }

    setBusyAction("reset");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setNotice(passwordResetNotice);
    } catch (error) {
      const code = getFirebaseErrorCode(error);
      if (code === "auth/user-not-found" || code === "auth/user-disabled") {
        setNotice(passwordResetNotice);
      } else {
        setErrorMessage(getLoginErrorMessage(code));
      }
    } finally {
      setBusyAction("");
    }
  };

  if (loading) {
    return <p className="auth-route-status" role="status">Verificando tu sesión…</p>;
  }

  if (user) {
    return <Navigate to={destination} replace />;
  }

  return (
    <section className="login-page" aria-labelledby="login-title">
      <div className="login-back-link">
        <Link to="/"><ArrowLeft size={16} /> Volver al inicio</Link>
      </div>
      <div className="login-card">
        <div className="login-card-aside">
          <div className="login-aside-icon"><LockKeyhole size={24} /></div>
          <p className="eyebrow">TU ESPACIO DE APRENDIZAJE</p>
          <h2>El conocimiento es tu mejor inversión.</h2>
          <p>Accede a tus cursos y sigue aprendiendo sobre criptoactivos a tu ritmo.</p>
          <div className="login-trust-note"><ShieldCheck size={17} /> Aprende con criterio, sin promesas de ganancias.</div>
        </div>
        <div className="login-form-panel">
          <p className="eyebrow">BIENVENIDO DE NUEVO</p>
          <h1 id="login-title">Inicia sesión</h1>
          <p className="login-subtitle">Ingresa tus datos para continuar tu recorrido.</p>
          {authError && <p className="form-notice form-error" role="alert">{authError}</p>}
          {!isFirebaseConfigured && (
            <p className="form-notice form-error" role="alert">
              Firebase no está configurado. Completa en <code>.env.local</code>:{" "}
              {missingFirebaseEnv.join(", ")}.
            </p>
          )}
          <button
            className="button button-google login-google"
            disabled={busy}
            onClick={handleGoogleSignIn}
            type="button"
          >
            <span className="google-mark" aria-hidden="true">G</span>
            {busyAction === "google" ? "Conectando con Google…" : "Continuar con Google"}
          </button>
          <div className="login-divider"><span>o ingresa con tu correo</span></div>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              autoComplete="email"
              id="login-email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
              required
              type="email"
              value={email}
            />
            <div className="login-password-label">
              <label htmlFor="login-password">Contraseña</label>
              <span><LockKeyhole size={14} /> Acceso seguro</span>
            </div>
            <div className="password-input-wrap">
              <input
                autoComplete="current-password"
                id="login-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Tu contraseña"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="password-visibility"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="login-options">
              <label className="remember-option">
                <input
                  checked={remember}
                  name="remember"
                  onChange={(event) => setRemember(event.target.checked)}
                  type="checkbox"
                />
                Recordarme
              </label>
              <button
                className="login-help-text login-reset-button"
                disabled={busy}
                onClick={handlePasswordReset}
                type="button"
              >
                {busyAction === "reset" ? "Enviando enlace…" : "¿Olvidaste tu contraseña?"}
              </button>
            </div>
            <button className="button button-primary login-submit" disabled={busy} type="submit">
              {busyAction === "email" ? "Conectando…" : "Ingresar"} <ArrowRight size={17} />
            </button>
            {errorMessage && <p className="form-notice form-error" role="alert">{errorMessage}</p>}
            {notice && <p className="form-notice" role="status">{notice}</p>}
          </form>
          <p className="login-demo-note">Acceso administrado por Firebase. Las cuentas con correo se crean en Firebase Console; con Google puedes iniciar con tu cuenta habitual.</p>
        </div>
      </div>
    </section>
  );
};

export default Login;
