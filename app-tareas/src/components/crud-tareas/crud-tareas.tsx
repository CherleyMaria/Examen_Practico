import { Component, State, h } from '@stencil/core';

interface Tarea {
  id?: number;
  titulo: string;
  tarea: string;
  dia: string;
}

@Component({
  tag: 'crud-tareas',
  styleUrl: 'crud-tareas.css',
  shadow: true,
})
export class TareasCrud {
  @State() tareas: Tarea[] = [];
  @State() nuevaTarea: Tarea = {
    titulo: '',
    tarea: '',
    dia: '',
  };
  @State() editandoTarea: Tarea | null = null;

  private apiUrl = 'http://localhost:3000/tareas';

  componentWillLoad() {
    this.cargarTareas();
  }

  async cargarTareas() {
    try {
      const response = await fetch(this.apiUrl);
      if (response.ok) {
        this.tareas = await response.json();
      } else {
        console.error('Error al cargar tareas:', response.statusText);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  }

  async crearTarea() {
    if (!this.nuevaTarea.titulo || !this.nuevaTarea.tarea || !this.nuevaTarea.dia) {
      alert('Todos los campos son obligatorios');
      return;
    }
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.nuevaTarea),
      });
      if (response.ok) {
        this.cargarTareas();
        this.nuevaTarea = { titulo: '', tarea: '', dia: '' };
      } else {
        console.error('Error al crear tarea:', response.statusText);
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  }

  async actualizarTarea() {
    if (this.editandoTarea && this.editandoTarea.id) {
      try {
        const response = await fetch(`${this.apiUrl}/${this.editandoTarea.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.editandoTarea),
        });
        if (response.ok) {
          this.cargarTareas();
          this.editandoTarea = null;
        } else {
          console.error('Error al actualizar tarea:', response.statusText);
        }
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
      }
    }
  }

  async eliminarTarea(id: number) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        this.cargarTareas();
      } else {
        console.error('Error al eliminar tarea:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  }

  handleInput(event: Event, field: string) {
    if (this.editandoTarea) {
      this.editandoTarea = { ...this.editandoTarea, [field]: (event.target as HTMLInputElement).value };
    } else {
      this.nuevaTarea = { ...this.nuevaTarea, [field]: (event.target as HTMLInputElement).value };
    }
  }

  setEditandoTarea(tarea: Tarea) {
    this.editandoTarea = { ...tarea };
  }

  render() {
    return (
      <div>
        <h2>Tareas CRUD</h2>
        <form onSubmit={(e) => { e.preventDefault(); this.editandoTarea ? this.actualizarTarea() : this.crearTarea(); }}>
          <input type="text" placeholder="Título" value={this.editandoTarea ? this.editandoTarea.titulo : this.nuevaTarea.titulo} onInput={(e) => this.handleInput(e, 'titulo')} />
          <input type="text" placeholder="Tarea" value={this.editandoTarea ? this.editandoTarea.tarea : this.nuevaTarea.tarea} onInput={(e) => this.handleInput(e, 'tarea')} />
          <input type="text" placeholder="Día" value={this.editandoTarea ? this.editandoTarea.dia : this.nuevaTarea.dia} onInput={(e) => this.handleInput(e, 'dia')} />
          <button type="submit">{this.editandoTarea ? 'Actualizar Tarea' : 'Crear Tarea'}</button>
          {this.editandoTarea && <button type="button" onClick={() => this.editandoTarea = null}>Cancelar</button>}
        </form>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Tarea</th>
              <th>Día</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.tareas.map((tarea) => (
              <tr key={tarea.id}>
                <td>{tarea.id}</td>
                <td>{tarea.titulo}</td>
                <td>{tarea.tarea}</td>
                <td>{tarea.dia}</td>
                <td>
                  <button onClick={() => this.setEditandoTarea(tarea)}>Editar</button>
                  <button onClick={() => this.eliminarTarea(tarea.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
