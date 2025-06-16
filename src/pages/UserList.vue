<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <h2 class="text-h5">Usuários</h2>
      <q-btn label="Novo Usuário" color="primary" icon="add" @click="abrirNovoUsuario" />
    </div>
    <q-table
      title="Lista de Usuários"
      :rows="usuarios"
      :columns="colunas"
      row-key="id"
      flat
      bordered
      :loading="carregando"
    >
      <template v-slot:body-cell-avatar="props">
        <q-td :props="props">
          <img
            :src="props.row.avatar"
            alt="avatar"
            class="q-avatar"
            style="width: 32px; border-radius: 50%"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense flat icon="edit" color="primary" @click="abrirEdicao(props.row)" />
          <q-btn dense flat icon="delete" color="negative" @click="excluirUsuario(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo para adicionar/editar -->
    <q-dialog v-model="dialogAberto">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">
            {{ editandoId ? 'Editar Usuário' : 'Novo Usuário' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="formNome" label="Nome" />
          <q-input v-model="formJob" label="Cargo" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="salvarUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QTableColumn } from 'quasar';

interface Usuario {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  job?: string;
}

const usuarios = ref<Usuario[]>([]);
const carregando = ref<boolean>(false);
const erro = ref<string | null>(null);

//para novos users
const dialogAberto = ref(false);
const formNome = ref('');
const formJob = ref('');
const editandoId = ref<number | null>(null);

const colunas: QTableColumn[] = [
  { name: 'avatar', label: 'Avatar', field: 'avatar', align: 'left' },
  { name: 'first_name', label: 'Nome', field: 'first_name', align: 'left' },
  { name: 'last_name', label: 'Sobrenome', field: 'last_name', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' },
];

async function listaUsers(): Promise<void> {
  carregando.value = true;

  try {
    const response = await fetch('https://reqres.in/api/users?page=1', {
      method: 'GET',
      headers: {
        'x-api-key': 'reqres-free-v1',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Erro ao carregar usuários');

    const data = await response.json();
    usuarios.value = data.data;
  } catch (error) {
    erro.value = 'Erro ao buscar usuários de API.';
    console.error(error);
  } finally {
    carregando.value = false;
  }
}

listaUsers().catch((e) => {
  console.log(e);
});

function abrirNovoUsuario() {
  formNome.value = '';
  formJob.value = '';
  editandoId.value = null;
  dialogAberto.value = true;
}

function abrirEdicao(user: Usuario) {
  formNome.value = user.first_name;
  formJob.value = user.job || 'Cargo não informado';
  editandoId.value = user.id;
  dialogAberto.value = true;
}

async function salvarUser(): Promise<void> {
  try {
    if (editandoId.value) {
      await fetch('https://reqres.in/api/users/2', {
        method: 'PUT',
        headers: { 'x-api-key': 'reqres-free-v1', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formNome.value,
          job: formJob.value,
        }),
      });

      const index = usuarios.value.findIndex((u) => u.id === editandoId.value);
      const usuarioEditado = usuarios.value[index];
      if (usuarioEditado) {
        usuarioEditado.first_name = formNome.value;
        usuarioEditado.job = formJob.value;
      }
    } else {
      const response = await fetch('https://reqres.in/api/users', {
        method: 'POST',
        headers: { 'x-api-key': 'reqres-free-v1', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formNome.value,
          job: formJob.value,
        }),
      });

      const data = await response.json();

      usuarios.value.push({
        id: parseInt(data.id) || Math.random(),
        first_name: formNome.value,
        last_name: '',
        email: '',
        avatar: '',
        job: formJob.value,
      });
    }

    dialogAberto.value = false;
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
  }
}

salvarUser().catch((e) => {
  console.log(e);
});

async function excluirUsuario(id: number) {
  try {
    await fetch(`https://reqres.in/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': 'reqres-free-v1', 'Content-Type': 'application/json' },
    });
    usuarios.value = usuarios.value.filter((u) => u.id !== id);
  } catch (e) {
    console.error('Erro ao excluir usuário:', e);
  }
}
</script>
