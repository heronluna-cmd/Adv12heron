import React, { useState, useEffect } from 'react';

const initialTodos = [
  {
    id: 1700445601,
    title: 'Grocery Shopping',
    description: 'Pick up milk, eggs, cheese, and fresh produce from the market.',
    date: new Date('2025-11-20T21:23:00'),
    completed: false,
  },
  {
    id: 1700445602,
    title: 'Pay Utility Bills',
    description: 'Ensure electricity and internet bills are paid before the due date (Friday).',
    date: new Date('2025-11-20T21:23:00'),
    completed: false,
  },
  {
    id: 1700445603,
    title: 'Call Mom',
    description: 'Check in and finalize plans for the upcoming holiday weekend.',
    date: new Date('2025-11-20T21:23:00'),
    completed: false,
  },
  {
    id: 1700445604,
    title: 'Car Wash',
    description: 'Take the car to the wash and check the tire pressure.',
    date: new Date('2025-11-20T21:23:00'),
    completed: false,
  },
  {
    id: 1700445605,
    title: 'Book Appointment',
    description: 'Schedule the annual physical check-up with Dr. Peterson.',
    date: new Date('2025-11-20T21:23:00'),
    completed: false,
  },
];

function formatDate(date) {
  return date.toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

export default function TodoApp() {
  const [todos, setTodos] = useState(initialTodos);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });

  // Filter todos based on tab and search
  const filteredTodos = todos.filter(todo => {
    const matchesTab = activeTab === 'todos' ? !todo.completed : todo.completed;
    const matchesSearch =
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.description.toLowerCase().includes(search.toLowerCase()) ||
      todo.id.toString().includes(search);
    return matchesTab && matchesSearch;
  });

  // Add or update todo
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    if (editingId !== null) {
      // Update existing
      setTodos(prev =>
        prev.map(todo =>
          todo.id === editingId
            ? {
                ...todo,
                title: form.title.trim(),
                description: form.description.trim(),
                date: new Date(),
              }
            : todo
        )
      );
      setEditingId(null);
    } else {
      // Add new
      const newTodo = {
        id: Date.now(),
        title: form.title.trim(),
        description: form.description.trim(),
        date: new Date(),
        completed: false,
      };
      setTodos(prev => [newTodo, ...prev]);
    }
    setForm({ title: '', description: '' });
  }

  // Edit todo
  function handleEdit(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setEditingId(id);
      setForm({ title: todo.title, description: todo.description });
      setActiveTab('todos');
    }
  }

  // Delete todo
  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setTodos(prev => prev.filter(todo => todo.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm({ title: '', description: '' });
      }
    }
  }

  // Mark complete/incomplete
  function toggleComplete(id) {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, date: new Date() }
          : todo
      )
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Todo List</h1>

      {/* Search and Add */}
      <div style={{ display: 'flex', marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flexGrow: 1,
            padding: '8px 12px',
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ title: '', description: '' });
            setActiveTab('todos');
          }}
          style={{
            marginLeft: 10,
            backgroundColor: '#635BFF',
            border: 'none',
            color: 'white',
            padding: '10px 16px',
            fontSize: 16,
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Add Todo
        </button>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: 15, borderBottom: '2px solid #ccc', display: 'flex' }}>
        {['todos', 'completed'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '3px solid #635BFF' : 'none',
              fontWeight: activeTab === tab ? '600' : 'normal',
              color: activeTab === tab ? '#635BFF' : '#555',
            }}
          >
            {tab === 'todos' ? 'Todos' : 'Completed'}
          </div>
        ))}
      </div>

      {/* Todo Form (for Add/Edit) */}
      {(editingId !== null || form.title || form.description) && activeTab === 'todos' && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: 20,
            padding: 15,
            border: '1px solid #ddd',
            borderRadius: 4,
            backgroundColor: '#fafafa',
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              style={{ width: '100%', padding: 8, fontSize: 16 }}
              required
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              style={{ width: '100%', padding: 8, fontSize: 16 }}
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#635BFF',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              fontSize: 16,
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {editingId !== null ? 'Update Todo' : 'Add Todo'}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ title: '', description: '' });
              }}
              style={{
                marginLeft: 10,
                backgroundColor: '#999',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                fontSize: 16,
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      {/* Todo Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f7f7f7', textAlign: 'left' }}>
          <tr>
            <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Title</th>
            <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Description</th>
            <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Date Created/Updated</th>
            <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#999' }}>
                No todos found.
              </td>
            </tr>
          ) : (
            filteredTodos.map(todo => (
              <tr key={todo.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{todo.id}</td>
                <td style={{ padding: 8 }}>{todo.title}</td>
                <td style={{ padding: 8 }}>{todo.description}</td>
                <td style={{ padding: 8 }}>{formatDate(todo.date)}</td>
                <td style={{ padding: 8 }}>
                  {!todo.completed && (
                    <button
                      onClick={() => handleEdit(todo.id)}
                      title="Edit"
                      style={{
                        backgroundColor: '#3b82f6',
                        border: 'none',
                        color: 'white',
                        marginRight: 6,
                        padding: '6px 10px',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(todo.id)}
                    title="Delete"
                    style={{
                      backgroundColor: '#ef4444',
                      border: 'none',
                      color: 'white',
                      marginRight: 6,
                      padding: '6px 10px',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    title={todo.completed ? 'Mark as Todo' : 'Mark as Completed'}
                    style={{
                      backgroundColor: '#22c55e',
                      border: 'none',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    ✔️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}