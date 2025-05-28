<script lang="ts">
  import { push } from 'svelte-spa-router';
  
  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';
  let success = false;

  async function handleRegister() {
    if (!username || !email || !password || !confirmPassword) {
      error = 'Please fill in all fields';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters long';
      return;
    }

    loading = true;
    error = '';

    try {
      const response = await fetch('https://workouts-api.mounis.net/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        success = true;
        setTimeout(() => {
          push('/login');
        }, 2000);
      } else {
        const data = await response.json();
        error = data.message || 'Registration failed';
      }
    } catch (err) {
      error = 'Connection error. Please try again.';
    } finally {
      loading = false;
    }
  }

  function goToLogin() {
    push('/login');
  }
</script>

<div class="register-container">
  <div class="register-card glass-container">
    <h1>Workout Tracker</h1>
    <h2>Create your account</h2>
    
    {#if error}
      <div class="error">{error}</div>
    {/if}

    {#if success}
      <div class="success">
        Account created successfully! Redirecting to login...
      </div>
    {/if}

    <form on:submit|preventDefault={handleRegister}>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          bind:value={username}
          placeholder="Choose a username"
          disabled={loading || success}
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="Enter your email"
          disabled={loading || success}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="Create a password (min 6 characters)"
          disabled={loading || success}
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          placeholder="Confirm your password"
          disabled={loading || success}
        />
      </div>

      <button type="submit" disabled={loading || success} class="register-btn btn btn-primary">
        {#if loading}
          <span class="loading"></span>
          Creating Account...
        {:else}
          Create Account
        {/if}
      </button>
    </form>

    <p class="login-link">
      Already have an account? 
      <button on:click={goToLogin} class="link-btn">Sign in</button>
    </p>
  </div>
</div>

<style>
  .register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
  }

  .register-card {
    width: 100%;
    max-width: 450px;
    padding: 3rem;
    position: relative;
    z-index: 1;
  }

  h1 {
    text-align: center;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
    background: linear-gradient(135deg, var(--primary-cyan), var(--primary-teal));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  h2 {
    text-align: center;
    color: var(--text-secondary);
    margin-bottom: 2.5rem;
    font-weight: var(--font-weight-normal);
    font-size: 1.1rem;
  }

  .register-btn {
    width: 100%;
    padding: 16px;
    font-size: 16px;
    margin-bottom: 1.5rem;
  }

  .register-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .login-link {
    text-align: center;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--primary-cyan);
    cursor: pointer;
    font-weight: var(--font-weight-medium);
    font-size: inherit;
    transition: all 0.3s ease;
  }

  .link-btn:hover {
    color: var(--primary-teal);
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .register-container {
      padding: 1rem;
    }
    
    .register-card {
      padding: 2rem;
    }
    
    h1 {
      font-size: 2rem;
    }
  }
</style>
