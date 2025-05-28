<script lang="ts">
  import Router from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { initAuth } from './stores/auth';
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut, elasticOut } from 'svelte/easing';
  import { location } from 'svelte-spa-router';
  
  // Import pages
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import AddWorkout from './pages/AddWorkout.svelte';
  import ViewWorkout from './pages/ViewWorkout.svelte';

  // Define routes with transition options
  const routes = {
    '/': Login,
    '/login': Login,
    '/register': Register,
    '/dashboard': Dashboard,
    '/add-workout': AddWorkout,
    '/workout/:id': ViewWorkout,
  };

  // Route transition config
  const routeTransitionConfig = {
    duration: 400,
    easing: cubicOut
  };

  let currentRoute = '';
  let appLoaded = false;
  
  // Track route changes for custom transitions
  $: {
    if ($location) {
      currentRoute = $location;
    }
  }

  onMount(async () => {
    // Simulate app loading for splash effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    await initAuth();
    appLoaded = true;
  });
</script>

<main>
  {#key currentRoute}
    <div 
      in:fly={{ y: 30, duration: 400, easing: cubicOut }}
      out:fly={{ y: -30, duration: 300, easing: cubicOut }}
      class="page-container"
    >
      <Router {routes} />
    </div>
  {/key}

  {#if !appLoaded}
    <div class="splash-screen" out:fade={{ duration: 500 }}>
      <div class="splash-content" in:scale={{ duration: 600, easing: elasticOut }}>
        <div class="logo animate-pulse" in:fly={{ y: -30, duration: 800, delay: 200 }}>🏋️</div>
        <h1 in:fly={{ y: 30, duration: 800, delay: 400 }}>Workout Tracker</h1>
        <div class="loading-text loading-dots" in:fly={{ y: 20, duration: 800, delay: 600 }}>Loading</div>
        <div class="loading-bar" in:fly={{ y: 30, duration: 800, delay: 800 }}>
          <div class="loading-progress"></div>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
  }

  .page-container {
    width: 100%;
    min-height: 100vh;
  }

  .splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, var(--primary-bg) 0%, var(--secondary-bg) 100%);
    z-index: 1000;
  }

  .splash-content {
    text-align: center;
    color: var(--text-primary);
  }

  .logo {
    font-size: 4rem;
    margin-bottom: 1rem;
    display: block;
  }

  .splash-content h1 {
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
    margin-bottom: 2rem;
    background: linear-gradient(135deg, var(--primary-cyan), var(--primary-teal));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .loading-text {
    color: var(--text-secondary);
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .loading-bar {
    width: 200px;
    height: 4px;
    background: var(--glass-bg);
    border-radius: 2px;
    margin: 0 auto;
    overflow: hidden;
  }

  .loading-progress {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-cyan), var(--primary-teal));
    border-radius: 2px;
    animation: loading-progress 2s ease-in-out;
  }

  @keyframes loading-progress {
    0% {
      width: 0%;
      transform: translateX(-100%);
    }
    50% {
      width: 100%;
      transform: translateX(0%);
    }
    100% {
      width: 100%;
      transform: translateX(100%);
    }
  }
</style>
