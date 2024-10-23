<template>
    <div class="container mx-auto py-10">
        <v-container>
            <v-row>
                <v-col
                    cols="12"
                    class="d-flex justify-between align-center mb-10"
                >
                    <v-badge
                        :content="store.favoritesData?.count_item"
                        color="red"
                        overlap
                        :class="store.favoritesData?.count_item === 0 ? 'invisible' : ''"
                    >
                    <v-btn
                        append-icon="mdi-heart"
                        text="Favorites"
                        rounded
                        min-width="auto"
                        border
                        elevation="4"
                        :disabled="!store.isAuthenticated"
                        @click="router.push('/favorites')"
                    />
                    </v-badge>

                    <v-btn
                        color="primary"
                        :append-icon="store.isAuthenticated ? 'mdi-logout' : 'mdi-login'"
                        :text="store.isAuthenticated ? 'Logout' : 'Login'"
                        rounded
                        min-width="auto"
                        border
                        elevation="4"
                        @click="store.isAuthenticated ? store.logout() : goToLogin()"
                    />
                </v-col>
            </v-row>
        </v-container>

        <h1 class="text-2xl font-bold mb-4 mt-10 text-center">{{ mainTitle }}</h1>

        <ProjectsSlider :projects="projects" />

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/stores/useStore';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ProjectsSlider from '@/components/ProjectsSlider.vue';

const store = useStore();
const router = useRouter();
const projects = ref([]);
const mainTitle = ref('');

definePageMeta({
  title: 'Homepage',
  meta: [
    { name: 'description', content: 'This is the homepage' },
  ],
});

const fetchProjects = async () => {
    store.loading = true;
    try {
        const response = await axios.get('https://sat7.faulio.com/api/v1/pageblocks/vod_main_page');
        mainTitle.value = response.data[2].title;
        
        projects.value = response.data[2].programsobjects;
        store.loading = false;
    } catch (error) {
        store.loading = false;
        console.error('Error fetching projects:', error);
    }
};

const goToLogin = () => {
  router.push('/signin');
};

onMounted(() => {
    fetchProjects();
    store.restoreSession();
});

</script>

<style lang="scss">

</style>  