<script lang="ts">
  import Router from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { initAuth } from './stores/auth';
  
  // Import pages
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import AddWorkout from './pages/AddWorkout.svelte';
  import ViewWorkout from './pages/ViewWorkout.svelte';

  // Define routes
  const routes = {
    '/': Login,
    '/login': Login,
    '/register': Register,
    '/dashboard': Dashboard,
    '/add-workout': AddWorkout,
    '/workout/:id': ViewWorkout,
  };

  onMount(() => {
    initAuth();
  });
</script>

<main>
  <Router {routes} />
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
  }
</style>
