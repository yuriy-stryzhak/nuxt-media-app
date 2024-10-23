<template>
    <div class="container mx-auto py-10">
        <v-container>
            <v-row>
                <v-col
                    cols="12"
                    class="d-flex justify-between align-center mb-10"
                >
                    <v-btn
                        prepend-icon="mdi-arrow-left"
                        text="Home"
                        rounded
                        min-width="auto"
                        border
                        elevation="4"
                        @click="router.push('/')"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    cols="12"
                >
                    <h1 class="text-2xl font-bold text-center mb-8">Favorites</h1>
                </v-col>
            </v-row>
        </v-container>

        <ProjectsSlider
            :projects="store.favoritesItems"
            @reach-end="loadMore"    
        />
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import { useStore } from '@/stores/useStore';
    import { useRouter } from 'vue-router';
    import ProjectsSlider from '@/components/ProjectsSlider.vue';

    const store = useStore();
    const router = useRouter();
    const currentPage = ref(1);

    // definePageMeta({
    //     middleware: 'auth'
    // });

    const loadMore = async() => {
        if (currentPage.value < store.favoritesLastPage) {
            currentPage.value += 1;
            await store.fetchFavorites(currentPage.value);
        }
    };

    onMounted(async () => {
        await store.restoreSession();

        if (!store.isAuthenticated) {
            router.push('/signin');
        }
    });

</script>