<script lang="ts">
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { clearAuth } from '../stores/auth';
  import type { WorkoutEntryForm } from '../types';
  
  let title = '';
  let description = '';
  let durationMinutes = '';
  let caloriesBurned = '';
  let entries: WorkoutEntryForm[] = [];
  let loading = false;
  let error = '';

  onMount(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      push('/login');
      return;
    }
    
    // Start with one empty entry
    addEntry();
  });

  function addEntry() {
    entries = [...entries, {
      exercise_name: '',
      sets: '',
      reps: '',
      duration_seconds: '',
      weight: '',
      notes: '',
      order_index: entries.length
    }];
  }

  function removeEntry(index: number) {
    entries = entries.filter((_, i) => i !== index);
    // Update order indices
    entries = entries.map((entry, i) => ({ ...entry, order_index: i }));
  }

  async function handleSubmit() {
    if (!title || !description || !durationMinutes) {
      error = 'Please fill in title, description, and duration';
      return;
    }

    if (entries.length === 0 || entries.every(e => !e.exercise_name)) {
      error = 'Please add at least one exercise';
      return;
    }

    loading = true;
    error = '';

    const token = localStorage.getItem('token');
    
    // Filter out empty entries and clean up data
    const validEntries = entries
      .filter(entry => entry.exercise_name.trim())
      .map(entry => ({
        exercise_name: entry.exercise_name.trim(),
        sets: entry.sets ? parseInt(entry.sets) : null,
        reps: entry.reps ? parseInt(entry.reps) : null,
        duration_seconds: entry.duration_seconds ? parseInt(entry.duration_seconds) : null,
        weight: entry.weight ? parseFloat(entry.weight) : null,
        notes: entry.notes || null,
        order_index: entry.order_index
      }));

    try {
      const response = await fetch('https://workouts-api.mounis.net/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          duration_minutes: parseInt(durationMinutes),
          calories_burned: caloriesBurned ? parseInt(caloriesBurned) : 0,
          entries: validEntries
        }),
      });

      if (response.ok) {
        push('/dashboard');
      } else if (response.status === 401) {
        clearAuth();
        push('/login');
      } else {
        const data = await response.json();
        error = data.message || 'Failed to create workout';
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
</script>

<div class="add-workout">
  <header class="header glass-container">
    <div class="header-content">
      <button on:click={goBack} class="back-btn btn btn-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m12 19-7-7 7-7"/>
          <path d="m19 12H5"/>
        </svg>
        Back to Dashboard
      </button>
      <h1>Add New Workout</h1>
    </div>
  </header>

  <main class="main-content">
    <div class="workout-form glass-container">
      {#if error}
        <div class="error">{error}</div>
      {/if}

      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-section">
          <h2>🏋️ Workout Details</h2>
          
          <div class="form-group">
            <label for="title">Workout Title *</label>
            <input
              id="title"
              type="text"
              bind:value={title}
              placeholder="e.g., Morning Cardio, Upper Body Strength"
              disabled={loading}
            />
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              bind:value={description}
              placeholder="Describe your workout routine..."
              disabled={loading}
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="duration">Duration (minutes) *</label>
              <input
                id="duration"
                type="number"
                bind:value={durationMinutes}
                placeholder="60"
                min="1"
                disabled={loading}
              />
            </div>

            <div class="form-group">
              <label for="calories">Calories Burned</label>
              <input
                id="calories"
                type="number"
                bind:value={caloriesBurned}
                placeholder="300"
                min="0"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="exercises-header">
            <h2>💪 Exercises</h2>
            <button type="button" on:click={addEntry} class="add-entry-btn btn btn-primary" disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Exercise
            </button>
          </div>

          <div class="entries-list">
            {#each entries as entry, index}
              <div class="entry-card glass-container">
                <div class="entry-header">
                  <h3>Exercise {index + 1}</h3>
                  {#if entries.length > 1}
                    <button
                      type="button"
                      on:click={() => removeEntry(index)}
                      class="remove-btn btn btn-danger"
                      disabled={loading}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Remove
                    </button>
                  {/if}
                </div>

                <div class="form-group">
                  <label for="exercise-{index}">Exercise Name *</label>
                  <input
                    id="exercise-{index}"
                    type="text"
                    bind:value={entry.exercise_name}
                    placeholder="e.g., Push-ups, Squats, Running"
                    disabled={loading}
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="sets-{index}">Sets</label>
                    <input
                      id="sets-{index}"
                      type="number"
                      bind:value={entry.sets}
                      placeholder="3"
                      min="1"
                      disabled={loading}
                    />
                  </div>

                  <div class="form-group">
                    <label for="reps-{index}">Reps</label>
                    <input
                      id="reps-{index}"
                      type="number"
                      bind:value={entry.reps}
                      placeholder="15"
                      min="1"
                      disabled={loading}
                    />
                  </div>

                  <div class="form-group">
                    <label for="duration-{index}">Duration (seconds)</label>
                    <input
                      id="duration-{index}"
                      type="number"
                      bind:value={entry.duration_seconds}
                      placeholder="60"
                      min="1"
                      disabled={loading}
                    />
                  </div>

                  <div class="form-group">
                    <label for="weight-{index}">Weight (kg)</label>
                    <input
                      id="weight-{index}"
                      type="number"
                      step="0.1"
                      bind:value={entry.weight}
                      placeholder="20.5"
                      min="0"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="notes-{index}">Notes</label>
                  <input
                    id="notes-{index}"
                    type="text"
                    bind:value={entry.notes}
                    placeholder="Any additional notes..."
                    disabled={loading}
                  />
                </div>
              </div>
            {/each}
          </div>
        </div>

        <div class="form-actions">
          <button type="button" on:click={goBack} class="cancel-btn btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" class="submit-btn btn btn-primary" disabled={loading}>
            {#if loading}
              <span class="loading"></span>
              Creating Workout...
            {:else}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              Create Workout
            {/if}
          </button>
        </div>
      </form>
    </div>
  </main>
</div>

<style>
  .add-workout {
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
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .back-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .header h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
  }

  .main-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .workout-form {
    padding: 3rem;
    position: relative;
  }

  .form-section {
    margin-bottom: 3rem;
  }

  .form-section:last-child {
    margin-bottom: 0;
  }

  .form-section h2 {
    color: var(--text-primary);
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--glass-border);
    font-size: 1.5rem;
    font-weight: var(--font-weight-semibold);
  }

  .exercises-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .exercises-header h2 {
    margin: 0;
    border: none;
    padding: 0;
  }

  .add-entry-btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
  }

  .entries-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .entry-card {
    padding: 2rem;
    position: relative;
    border: 1px solid var(--glass-border);
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .entry-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.2rem;
    font-weight: var(--font-weight-semibold);
  }

  .remove-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--glass-border);
  }

  .cancel-btn,
  .submit-btn {
    padding: 12px 24px;
    font-size: 14px;
  }

  .submit-btn:disabled,
  .cancel-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    .add-workout {
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

    .main-content {
      padding: 0 1rem;
    }

    .workout-form {
      padding: 2rem;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .exercises-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .form-actions {
      flex-direction: column;
    }

    .entry-card {
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .header-content {
      gap: 0.5rem;
    }

    .header h1 {
      font-size: 1.5rem;
    }

    .workout-form {
      padding: 1.5rem;
    }

    .form-section h2 {
      font-size: 1.3rem;
    }
  }
</style>
