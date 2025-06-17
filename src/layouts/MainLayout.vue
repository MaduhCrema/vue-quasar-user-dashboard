<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> User Management </q-toolbar-title>

        <q-btn color="white" class="text-black" @click="logout">Logout</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Cookies } from 'quasar';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

import { useRouter } from 'vue-router';

const router = useRouter();

async function verificaSessao(): Promise<void> {
  const token = Cookies.get('token');

  if (token) {
    console.log('Token válido!');
  } else {
    console.log('Token inválido!');
    await router.push('/login');
  }
}

verificaSessao().catch((e) => {
  console.log(e);
});

async function logout(): Promise<void> {
  Cookies.remove('token');
  await router.push('/login');
}

const linksList: EssentialLinkProps[] = [
  {
    title: 'Home',
    caption: 'Dashboard',
    icon: 'home',
    link: 'home',
  },
  {
    title: 'Usuários',
    caption: 'lista de usuários',
    icon: 'account_circle',
    link: 'user',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
