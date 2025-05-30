<script lang="ts">
  import { push } from 'svelte-spa-router';
  import { login } from '../stores/auth';
  import { fly, fade, scale } from 'svelte/transition';
  import { elasticOut, cubicOut } from 'svelte/easing';
  
  let username = '';
  let password = '';
  let loading = false;
  let error = '';
  let formVisible = false;

  // Trigger form animation on mount
  import { onMount } from 'svelte';
  onMount(() => {
    setTimeout(() => {
      formVisible = true;
    }, 100);
  });

  async function handleLogin() {
    if (!username || !password) {
      error = 'Please fill in all fields';
      return;
    }

    loading = true;
    error = '';

    const result = await login(username, password);
    
    if (result.success) {
      push('/dashboard');
    } else {
      error = result.error || 'Login failed';
    }
    
    loading = false;
  }

  function goToRegister() {
    push('/register');
  }
</script>

<div class="login-container">
  <div class="login-card glass-container" in:scale={{ duration: 600, easing: elasticOut }}>
    <h1 in:fly={{ y: -20, duration: 600, delay: 200, easing: cubicOut }}>Workout Tracker</h1>
    <h2 in:fly={{ y: -20, duration: 600, delay: 300, easing: cubicOut }}>Welcome back</h2>
    
    {#if error}
      <div class="error" in:fly={{ x: -30, duration: 400 }}>{error}</div>
    {/if}

    <form on:submit|preventDefault={handleLogin} in:fade={{ duration: 600, delay: 400 }}>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          bind:value={username}
          placeholder="Enter your username"
          disabled={loading}
          class="hover-glow"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="Enter your password"
          disabled={loading}
          class="hover-glow"
        />
      </div>

      <button type="submit" disabled={loading} class="login-btn btn btn-primary hover-glow ripple">
        {#if loading}
          <span class="loading"></span>
          Logging in...
        {:else}
          Login
        {/if}
      </button>
    </form>

    <p class="register-link" in:fade={{ duration: 600, delay: 600 }}>
      Don't have an account? 
      <button on:click={goToRegister} class="link-btn hover-scale">Create account</button>
    </p>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
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

  .login-btn {
    width: 100%;
    padding: 16px;
    font-size: 16px;
    margin-bottom: 1.5rem;
  }

  .login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .register-link {
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
    .login-container {
      padding: 1rem;
    }
    
    .login-card {
      padding: 2rem;
    }
    
    h1 {
      font-size: 2rem;
    }
  }
</style>
