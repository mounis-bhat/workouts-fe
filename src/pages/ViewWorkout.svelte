<script lang="ts">
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { clearAuth } from '../stores/auth';
  import { fly, fade, scale } from 'svelte/transition';
  import { elasticOut, cubicOut } from 'svelte/easing';
  import type { Workout, WorkoutEntry } from '../types';

  export let params: { id: string };

  let workout: Workout | null = null;
  let loading = true;
  let error = '';
  let contentVisible = false;

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      push('/login');
      return;
    }

    await loadWorkout();
    
    // Trigger content animation after loading
    if (workout) {
      setTimeout(() => {
        contentVisible = true;
      }, 100);
    }
  });

  async function loadWorkout() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://workouts-api.mounis.net/workouts/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        workout = data.workout || data;
      } else if (response.status === 401) {
        clearAuth();
        push('/login');
        return;
      } else if (response.status === 404) {
        error = 'Workout not found';
      } else {
        error = 'Failed to load workout';
      }
    } catch (err) {
      error = 'Connection error. Please try again.';
    } finally {
      loading = false;
    }
  }

  function goBack() {
    push('/dashboard');
  }

  function editWorkout() {
    push(`/edit-workout/${params.id}`);
  }

  async function deleteWorkout() {
    if (!confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://workouts-api.mounis.net/workouts/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        push('/dashboard');
      } else if (response.status === 401) {
        clearAuth();
        push('/login');
      } else {
        alert('Failed to delete workout');
      }
    } catch (err) {
      alert('Connection error. Please try again.');
    }
  }

  function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
</script>

<div class="view-workout">
  <header class="header glass-container">
    <div class="header-content">
      <button on:click={goBack} class="back-btn btn btn-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m12 19-7-7 7-7"/>
          <path d="m19 12H5"/>
        </svg>
        Back to Dashboard
      </button>
      <h1>📋 Workout Details</h1>
      <div class="header-actions">
        {#if workout}
          <button on:click={editWorkout} class="edit-btn btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5-7 7V14h4.5l7-7a2.121 2.121 0 0 0 0-3L18.5 2.5z"/>
            </svg>
            Edit
          </button>
          <button on:click={deleteWorkout} class="delete-btn btn btn-danger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
            </svg>
            Delete
          </button>
        {/if}
      </div>
    </div>
  </header>

  <main class="main-content">
    {#if loading}
      <div class="simple-loader">
        <div class="loader-spinner"></div>
        <div class="loader-text">Loading workout...</div>
      </div>
    {:else if error}
      <div class="error">{error}</div>
    {:else if workout}
      <div class="workout-details glass-container">
        <div class="workout-header">
          <h2>{workout.title}</h2>
          <span class="workout-date">
            📅 {new Date(workout.created_at).toLocaleDateString()}
          </span>
        </div>

        <div class="workout-info">
          <p class="description">{workout.description || 'No description provided'}</p>
          
          <div class="workout-stats">
            <div class="stat-card glass-container">
              <span class="stat-icon">⏱️</span>
              <div class="stat-value">{formatDuration(workout.duration_minutes)}</div>
              <div class="stat-label">Duration</div>
            </div>
            <div class="stat-card glass-container">
              <span class="stat-icon">🔥</span>
              <div class="stat-value">{workout.calories_burned}</div>
              <div class="stat-label">Calories Burned</div>
            </div>
            <div class="stat-card glass-container">
              <span class="stat-icon">💪</span>
              <div class="stat-value">{workout.entries?.length || 0}</div>
              <div class="stat-label">Exercises</div>
            </div>
          </div>
        </div>

        {#if workout.entries && workout.entries.length > 0}
          <div class="exercises-section">
            <h3>🏋️ Exercises</h3>
            <div class="exercises-list">
              {#each workout.entries as entry, index}
                <div class="exercise-card glass-container">
                  <div class="exercise-header">
                    <h4>{entry.exercise_name}</h4>
                    <span class="exercise-number">#{index + 1}</span>
                  </div>
                  <div class="exercise-details">
                    {#if entry.sets}
                      <div class="detail">
                        <span class="detail-label">Sets</span>
                        <span class="detail-value">{entry.sets}</span>
                      </div>
                    {/if}
                    {#if entry.reps}
                      <div class="detail">
                        <span class="detail-label">Reps</span>
                        <span class="detail-value">{entry.reps}</span>
                      </div>
                    {/if}
                    {#if entry.duration_seconds}
                      <div class="detail">
                        <span class="detail-label">Duration</span>
                        <span class="detail-value">{entry.duration_seconds}s</span>
                      </div>
                    {/if}
                    {#if entry.weight}
                      <div class="detail">
                        <span class="detail-label">Weight</span>
                        <span class="detail-value">{entry.weight} kg</span>
                      </div>
                    {/if}
                    {#if entry.notes}
                      <div class="detail notes">
                        <span class="detail-label">Notes</span>
                        <span class="detail-value">{entry.notes}</span>
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </main>
</div>

<style>
  .view-workout {
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

  .back-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .edit-btn,
  .delete-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .workout-details {
    padding: 3rem;
    position: relative;
  }

  .workout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--glass-border);
  }

  .workout-header h2 {
    margin: 0;
    color: var(--text-primary);
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
  }

  .workout-date {
    color: var(--text-muted);
    font-size: 1rem;
    font-weight: var(--font-weight-medium);
  }

  .workout-info {
    margin-bottom: 3rem;
  }

  .description {
    color: var(--text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .workout-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .stat-card {
    padding: 2rem;
    text-align: center;
    position: relative;
  }

  .stat-icon {
    display: block;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    line-height: 1;
  }

  .stat-label {
    color: var(--text-muted);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: var(--font-weight-medium);
  }

  .exercises-section {
    border-top: 1px solid var(--glass-border);
    padding-top: 3rem;
  }

  .exercises-section h3 {
    color: var(--text-primary);
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: var(--font-weight-semibold);
  }

  .exercises-list {
    display: grid;
    gap: 1.5rem;
  }

  .exercise-card {
    padding: 2rem;
    position: relative;
  }

  .exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .exercise-card h4 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.3rem;
    font-weight: var(--font-weight-semibold);
  }

  .exercise-number {
    background: var(--primary-cyan);
    color: var(--primary-bg);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: var(--font-weight-semibold);
  }

  .exercise-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1.5rem;
  }

  .detail {
    text-align: center;
    padding: 1rem;
    background: rgba(148, 163, 184, 0.05);
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--glass-border);
  }

  .detail.notes {
    grid-column: 1 / -1;
    text-align: left;
  }

  .detail-label {
    display: block;
    color: var(--text-muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
    font-weight: var(--font-weight-medium);
  }

  .detail-value {
    color: var(--text-primary);
    font-weight: var(--font-weight-semibold);
    font-size: 1.1rem;
  }

  .detail.notes .detail-value {
    font-size: 0.95rem;
    font-weight: var(--font-weight-normal);
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .view-workout {
      padding: 1rem 0;
    }

    .header {
      margin: 0 1rem 2rem 1rem;
    }

    .header-content {
      padding: 1rem;
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .header-actions {
      order: -1;
    }

    .main-content {
      padding: 0 1rem;
    }

    .workout-details {
      padding: 2rem;
    }

    .workout-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .workout-header h2 {
      font-size: 2rem;
    }

    .workout-stats {
      grid-template-columns: 1fr;
    }

    .exercise-details {
      grid-template-columns: repeat(2, 1fr);
    }

    .exercise-header {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .workout-details {
      padding: 1.5rem;
    }

    .stat-card {
      padding: 1.5rem;
    }

    .stat-value {
      font-size: 2rem;
    }

    .exercise-details {
      grid-template-columns: 1fr;
    }

    .exercise-card {
      padding: 1.5rem;
    }
  }
</style>
