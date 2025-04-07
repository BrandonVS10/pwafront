import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import './Register.css'

Modal.setAppElement('#root');

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkPendingUsers();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkPendingUsers = () => {
    let dbRequest = indexedDB.open("database", 2);

    dbRequest.onsuccess = (event) => {
      const db = event.target.result;

      if (db.objectStoreNames.contains("Usuarios")) {
        const transaction = db.transaction("Usuarios", "readonly");
        const store = transaction.objectStore("Usuarios");

        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          if (getAllRequest.result.length > 0) {
            setPendingUsers(getAllRequest.result);
            setShowModal(true);
          }
        };
      }
    };
  };

  const resendData = async () => {
    for (let user of pendingUsers) {
      try {
        const response = await fetch('https://back001pwa.onrender.com/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          console.log("✅ Usuario reenviado:", user.email);
        }
      } catch (error) {
        console.error("❌ Error al reenviar:", user.email, error);
      }
    }

    // Limpiar IndexedDB
    let dbRequest = indexedDB.open("database", 2);
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("Usuarios", "readwrite");
      const store = transaction.objectStore("Usuarios");
      store.clear();
    };

    setPendingUsers([]);
    setShowModal(false);
    alert("Datos reenviados correctamente.");
    navigate('/');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isOnline) {
      setError('Sin conexion, tus datos se guardaran cuando te reconectes.');
      insertIndexedDB({ email, nombre, password });
      return;
    }

    try {
      const response = await fetch('https://back001pwa.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registro exitoso.');
        navigate('/');
      } else {
        setError(data.message || 'Error al registrarte.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor.');
    }
  };

  const insertIndexedDB = (data) => {
    const dbRequest = indexedDB.open("database", 2);

    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("Usuarios")) {
        db.createObjectStore("Usuarios", { keyPath: "email" });
      }
    };

    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("Usuarios", "readwrite");
      const store = transaction.objectStore("Usuarios");
      store.put(data);
    };
  };

  /*  return (
     <div style={styles.container}>
       <form style={styles.form} onSubmit={handleRegister}>
         <h2 style={styles.heading}>Registro</h2>
         {error && <div style={styles.error}>{error}</div>}
         <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} style={styles.input} />
         <input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
         <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
         <button type="submit" style={styles.button}>Registrar</button>
       </form>
 
       <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} contentLabel="Usuarios pendientes" style={modalStyles}>
         <h2>Usuarios pendientes de registro</h2>
         <ul>
           {pendingUsers.map((user, index) => (
             <li key={index}><strong>{user.nombre}</strong> ({user.email})</li>
           ))}
         </ul>
         <button onClick={resendData} style={styles.button}>Reenviar datos</button>
         <button onClick={() => setShowModal(false)} style={{ ...styles.button, backgroundColor: 'gray' }}>Cancelar</button>
       </Modal>
     </div>
   ); */

  return (
    <div className="wrapper">
      <div className="back-arrow" onClick={() => navigate(-1)}>
        <div className="circle">
          <FaArrowLeft className="icon_back" />
        </div>
      </div>

      <h1>Registro</h1>
      <div className="line" />


      <form onSubmit={handleRegister}>
        {error && <p className="error-message">{error}</p>}
        <div className="input-box">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>

        {/* 
        <div className="input-box">
          <input
            type="text"
            name="app"
            placeholder="Apellido Paterno"
            value={formData.app}
            onChange={(e) => setFormData({ ...formData, app: e.target.value })}
            required
          />
          <FaUser className="icon" />
        </div>
  
        <div className="input-box">
          <input
            type="text"
            name="apm"
            placeholder="Apellido Materno"
            value={formData.apm}
            onChange={(e) => setFormData({ ...formData, apm: e.target.value })}
            required
          />
          <FaUser className="icon" />
        </div> 
        */}

        <div className="input-box">
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FaEnvelope className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        <button type="submit">Registrarse</button>
      </form>
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Usuarios pendientes"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <h2 className="modal-title">Usuarios pendientes de registro</h2>

        {pendingUsers.length === 0 ? (
          <p className="modal-empty">No hay usuarios pendientes.</p>
        ) : (
          <ul className="user-list">
            {pendingUsers.map((user, index) => (
              <li key={index} className="user-item">
              <ul>
                <li><strong>Nombre:</strong> {user.nombre}</li>
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Contraseña:</strong> {user.password}</li>
              </ul>
            </li>
            
            ))}
          </ul>
        )}

        <div className="button-group">
          <button onClick={resendData} className="modal-button primary">
            Reenviar datos
          </button>
          <button onClick={() => setShowModal(false)} className="modal-button secondary">
            Cancelar
          </button>
        </div>
      </Modal>

    </div>
  );

};

/* const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f9',
  },
  form: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    color: '#4CAF50',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    color: '#f44336',
    marginBottom: '10px',
  },
}; */



export default Register;