<script lang="ts">
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { clearAuth } from '../stores/auth';
  import { fly, fade, scale } from 'svelte/transition';
  import { elasticOut, cubicOut } from 'svelte/easing';
  import type { Workout, User, WorkoutsResponse } from '../types';
  
  let workouts: Workout[] = [];
  let loading = true;
  let error = '';
  let user: User | null = null;
  let animateCards = false;

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      push('/login');
      return;
    }

    await loadUserData();
    await loadWorkouts();
    
    // Trigger card animations after loading
    setTimeout(() => {
      animateCards = true;
    }, 100);
  });

  async function loadUserData() {
    const token = localStorage.getItem('token');
    try {
      // Note: You'll need to extract username from token or store it separately
      // For now, we'll just show a placeholder
      user = { username: 'User' };
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  }

  async function loadWorkouts() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://workouts-api.mounis.net/workouts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: WorkoutsResponse = await response.json();
        workouts = data.workouts || [];
      } else if (response.status === 401) {
        // Token is invalid or expired, clear auth and redirect
        clearAuth();
        push('/login');
        return;
      } else {
        error = 'Failed to load workouts';
      }
    } catch (err) {
      error = 'Connection error. Please try again.';
    } finally {
      loading = false;
    }
  }

  function logout() {
    clearAuth();
    push('/login');
  }

  function goToAddWorkout() {
    push('/add-workout');
  }

  function viewWorkout(id: number) {
    push(`/workout/${id}`);
  }

  function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
</script>

<div class="dashboard">
  <header class="header glass-container" in:fly={{ y: -30, duration: 600, easing: cubicOut }}>
    <div class="header-content">
      <h1>🏋️ Workout Tracker</h1>
      <div class="header-actions">
        <span class="welcome">Welcome back, {user?.username || 'User'}!</span>
        <button on:click={logout} class="logout-btn btn btn-secondary">Logout</button>
      </div>
    </div>
  </header>

  <main class="main-content">
    <div class="dashboard-header" in:fly={{ y: 30, duration: 600, delay: 200, easing: cubicOut }}>
      <h2>Your Workouts</h2>
      <button on:click={goToAddWorkout} class="add-workout-btn btn btn-primary hover-glow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Workout
      </button>
    </div>

    {#if loading}
      <div class="simple-loader" in:fade={{ duration: 300 }}>
        <div class="loader-spinner animate-pulse"></div>
        <div class="loader-text">Loading your workouts...</div>
      </div>
    {:else if error}
      <div class="error" in:fly={{ x: -30, duration: 400 }}>{error}</div>
    {:else if workouts.length === 0}
      <div class="empty-state glass-container" in:scale={{ duration: 600, delay: 300, easing: elasticOut }}>
        <div class="empty-icon animate-float">💪</div>
        <h3>No workouts yet!</h3>
        <p>Start tracking your fitness journey by adding your first workout.</p>
        <button on:click={goToAddWorkout} class="add-first-workout-btn btn btn-primary hover-glow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Your First Workout
        </button>
      </div>
    {:else}
      <div class="workouts-grid">
        {#each workouts as workout, i}
          <button 
            class="workout-card glass-container hover-lift" 
            on:click={() => viewWorkout(workout.id)}
            on:keydown={(e) => e.key === 'Enter' && viewWorkout(workout.id)}
            type="button"
            in:fly={{ y: 50, duration: 600, delay: i * 100, easing: cubicOut }}
            out:scale={{ duration: 300, easing: cubicOut }}
          >
            <div class="workout-header">
              <h3>{workout.title}</h3>
              <span class="workout-date">
                {new Date(workout.created_at).toLocaleDateString()}
              </span>
            </div>
            <p class="workout-description">{workout.description || 'No description'}</p>
            <div class="workout-stats">
              <div class="stat">
                <span class="stat-icon">⏱️</span>
                <span class="stat-label">Duration</span>
                <span class="stat-value">{formatDuration(workout.duration_minutes)}</span>
              </div>
              <div class="stat">
                <span class="stat-icon">🔥</span>
                <span class="stat-label">Calories</span>
                <span class="stat-value">{workout.calories_burned}</span>
              </div>
              <div class="stat">
                <span class="stat-icon">💪</span>
                <span class="stat-label">Exercises</span>
                <span class="stat-value">{workout.entries?.length || 0}</span>
              </div>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </main>
</div>

<style>
  .dashboard {
    min-height: 100vh;
    padding: 2rem 0;
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    margin: 0 2rem 3rem 2rem;
    border-radius: var(--border-radius);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .welcome {
    font-size: 1rem;
    color: var(--text-secondary);
    font-weight: var(--font-weight-medium);
  }

  .logout-btn {
    font-size: 14px;
    padding: 8px 16px;
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .dashboard-header h2 {
    margin: 0;
    color: var(--text-primary);
    font-size: 2rem;
    font-weight: var(--font-weight-bold);
  }

  .add-workout-btn {
    font-size: 14px;
    padding: 12px 20px;
  }

  .empty-state {
    text-align: center;
    padding: 4rem;
    margin: 2rem 0;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: var(--font-weight-semibold);
  }

  .empty-state p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .add-first-workout-btn {
    padding: 16px 24px;
    font-size: 16px;
  }

  .workouts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1.5rem;
  }

  .workout-card {
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    text-align: left;
    width: 100%;
    font-family: inherit;
    position: relative;
  }

  .workout-card:hover {
    transform: translateY(-4px);
  }

  .workout-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .workout-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.3rem;
    font-weight: var(--font-weight-semibold);
  }

  .workout-date {
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: var(--font-weight-medium);
  }

  .workout-description {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .workout-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat {
    text-align: center;
    padding: 1rem;
    background: rgba(148, 163, 184, 0.05);
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--glass-border);
  }

  .stat-icon {
    display: block;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    display: block;
    color: var(--text-muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
    font-weight: var(--font-weight-medium);
  }

  .stat-value {
    display: block;
    color: var(--text-primary);
    font-size: 1.1rem;
    font-weight: var(--font-weight-semibold);
  }

  @media (max-width: 768px) {
    .dashboard {
      padding: 1rem 0;
    }

    .header {
      margin: 0 1rem 2rem 1rem;
    }

    .header-content {
      padding: 1rem;
      flex-direction: column;
      gap: 1rem;
    }

    .main-content {
      padding: 0 1rem;
    }

    .dashboard-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .dashboard-header h2 {
      font-size: 1.5rem;
    }

    .workouts-grid {
      grid-template-columns: 1fr;
    }

    .workout-card {
      padding: 1.5rem;
    }

    .stat {
      padding: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .welcome {
      display: none;
    }

    .header h1 {
      font-size: 1.5rem;
    }

    .workout-stats {
      grid-template-columns: 1fr;
    }
  }
</style>
