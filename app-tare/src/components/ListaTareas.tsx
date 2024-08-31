import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";

interface tarea {
    "id": number;
    "titulo": string;
    "tarea": string;
    "autor": string;
    "dia": string;
}

export const ListaTareas: React.FC = () => {
    const [tareas, setTareas] = useState<tarea[]>([]);
    const [selectedtarea, setSelectedtarea] = useState<tarea | null>(null);
    const toast = useRef<Toast>(null);
    const [displayDialog, setDisplasDialog] = useState<boolean>(false);
    const [displayDlgEliminar, setDisplayDlgEliminar] = useState<boolean>(false);

    useEffect(() => {
        fecthTareas();
    }, []);

    const fecthTareas = async () => {
        try {
            const response = await fetch('http://localhost:3000/tareas');
            const data = await response.json();
            setTareas(data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'fecthTareas dice: ' + error, life: 3000 });
        }
    }

    const openNewtareaDlg = () => {
        setSelectedtarea({
            "id": 0,
            "titulo": '',
            "tarea": '',
            "autor": '',
            "dia": ''
        });
        setDisplasDialog(true);
    }

    const guardar = async () => {
        if (!selectedtarea) return;
        try {
            const response = await fetch('http://localhost:3000/tareas' + (selectedtarea.id ? `/${selectedtarea.id}` : ''), {
                method: selectedtarea.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedtarea)
            });
            if (response.ok) {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Tarea guardado exitosamente', life: 3000 });
                fecthTareas();
                setDisplasDialog(false);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el tarea', life: 3000 });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error: ' + error, life: 3000 });
        }
    }

    const editartarea = (tarea: tarea) => {
        setSelectedtarea({ ...tarea });
        setDisplasDialog(true);
    }

    const eliminartarea = (tarea: tarea) => {
        setSelectedtarea({ ...tarea });
        setDisplayDlgEliminar(true);
    }

    const deletetarea = async () => {
        if (!selectedtarea) return;
        try {
            const response = await fetch(`http://localhost:3000/tareas/${selectedtarea.id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Tarea eliminado exitosamente', life: 3000 });
                fecthTareas();
                setDisplayDlgEliminar(false);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el tarea', life: 3000 });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error: ' + error, life: 3000 });
        }
    }

    return (
        <div>
            <h1>Gestión de Tareas</h1>
            <Toast ref={toast} />
            <Button label="Nuevo"
                icon="pi pi-plus"
                onClick={openNewtareaDlg} />
            <DataTable
                value={tareas}
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
            >
                <Column field="id" header="Id"></Column>
                <Column field="titulo" header="Titulo"></Column>
                <Column field="tarea" header="Tarea"></Column>
                <Column field="editorial" header="Autor"></Column>
                <Column field="dia" header="Dia"></Column>
                <Column
                    header="Acciones"
                    body={
                        (rowData: tarea) => (
                            <div>
                                <Button
                                    icon="pi pi-pencil"
                                    onClick={() => editartarea(rowData)}
                                />
                                <Button
                                    className="p-button-danger"
                                    icon="pi pi-trash"
                                    onClick={() => eliminartarea(rowData)}
                                />
                            </div>
                        )}
                />
            </DataTable>

            <Dialog
                header="Detalles de la Tarea"
                visible={displayDialog}
                onHide={() => setDisplasDialog(false)}
            >
                <div className="p-grid p-fluid">

                    <div className="p-col-4">
                        <label htmlFor="titulo">Título</label>
                    </div>
                    <div className="p-col-8">
                        <InputText
                            id="titulo"
                            value={selectedtarea?.titulo || ''}
                            onChange={(e) => setSelectedtarea({ ...selectedtarea!, titulo: e.target.value })}
                        />
                    </div>

                    <div className="p-col-4">
                        <label htmlFor="tarea">Tarea</label>
                    </div>
                    <div className="p-col-8">
                        <InputText
                            id="tarea"
                            value={selectedtarea?.tarea || ''}
                            onChange={(e) => setSelectedtarea({ ...selectedtarea!, tarea: e.target.value })}
                        />
                    </div>

                    <div className="p-col-4">
                        <label htmlFor="autor">Autor</label>
                    </div>
                    <div className="p-col-8">
                        <InputText
                            id="autor"
                            value={selectedtarea?.autor || ''}
                            onChange={(e) => setSelectedtarea({ ...selectedtarea!, autor: e.target.value })}
                        />
                    </div>

                    

                    <div className="p-col-4">
                        <label htmlFor="dia">Dia</label>
                    </div>
                    <div className="p-col-8">
                        <InputText
                            id="dia"
                            value={selectedtarea?.dia || ''}
                            onChange={(e) => setSelectedtarea({ ...selectedtarea!, dia: e.target.value })}
                        />
                    </div>

                </div>

                <Button label="Guardar" icon="pi pi-save" onClick={guardar} />

            </Dialog>

            <Dialog
                header="Eliminar"
                visible={displayDlgEliminar}
                onHide={() => setDisplayDlgEliminar(false)}
            >
                <p>Está seguro de elinminar la tarea {selectedtarea?.titulo}?</p>
                <Button label="Si" icon="pi pi-check" onClick={deletetarea} />
                <Button label="No" icon="pi pi-times" onClick={() => setDisplayDlgEliminar(false)} />
            </Dialog>
        </div>
    );
};