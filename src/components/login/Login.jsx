import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://back001pwa.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del servidor:", data); // Asegúrate de que `data.user._Id` y `data.user.role` estén presentes.
      
        // Verifica si los valores son correctos antes de guardarlos
        
          localStorage.setItem('userId', data.user._id); // Asegúrate de que esto sea correcto
          localStorage.setItem('userRole', data.user.role); // Asegúrate de que esto sea correcto
          localStorage.setItem('userNombre', data.user.nombre);
          console.log("ID del usuario guardado:", data.user._id);
          console.log("Rol del usuario guardado:", data.user.role);
      
          alert('✅ Login exitoso');
          navigate('/users');
        
      } else {
        throw new Error(data.message || 'Error al iniciar sesión.');
      }
    } catch (err) {
      setError(err.message || 'No se pudo conectar al servidor. Inténtalo nuevamente más tarde.');
    }
  };

  /* return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.heading}>Iniciar Sesión</h2>
        {error && <div style={styles.error}>{error}</div>}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Iniciar Sesión</button>
      </form>
    </div>
  ); */


    return (
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Iniciar sesión</h1>
          {error && <p className="error-message">{error}</p>}
    
          <div className="input-box">
            <input
              type="email"
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
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
    
          <button type="submit">Inicia sesión</button>
    
          <div className="register-link">
            <p>
              ¿No tienes cuenta?{' '}
              <span onClick={() => navigate('/register')} className="a">
                Regístrate
              </span>
            </p>
          </div>
        </form>
      </div>
    );
    
 

}
export default Login;
