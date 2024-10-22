<template>
    <div class="container mx-auto py-10">
        <v-row>
            <v-col
                cols="12"
                class="d-flex justify-end"
            >
                <v-btn
                    color="primary"
                    :append-icon="store.isAuthenticated ? 'mdi-logout' : 'mdi-login'"
                    :text="store.isAuthenticated ? 'Logout' : 'Login'"
                    rounded
                    min-width="auto"
                    border
                    elevation="4"
                    class="mb-10"
                    @click="store.isAuthenticated ? store.logout() : goToLogin()"
                />
            </v-col>
        </v-row>
        <h1 class="text-2xl font-bold mb-4 mt-10 text-center">{{ mainTitle }}</h1>
        <Swiper
            :modules="[Navigation, Pagination]"
            :slides-per-view="1"
            navigation
            :space-between="15"
            :pagination="{ clickable: true }"
            class="mySwiper pt-4 pb-14 px-12"
            :breakpoints="{
                '640': {
                    slidesPerView: 2,
                },
                '768': {
                    slidesPerView: 3,
                },
                '1024': {
                    slidesPerView: 4,
                },
            }"
        >
            <SwiperSlide 
                v-for="item in projects" 
                :key="item.id"
            >

                <v-card>

                    <v-img
                        height="250"
                        :src="item.allimages.landscape.fullhd"
                        cover
                    />

                    <v-card-item>
                        <v-card-title class="text-h5">{{ item.title }}</v-card-title>
                    </v-card-item>

                    <v-card-text>
                        <div class="line-clamp-4">{{ item.description }}</div>
                    </v-card-text>

                    <v-divider class="mx-4 mb-1" />

                    <v-card-actions>
                        <v-btn
                            color="primary"
                            append-icon="mdi-heart"
                            :text="isFavorite(item.id) ? 'Remove from Favorites' : 'Add to Favorites'"
                            block
                            rounded
                            min-width="auto"
                            border
                            @click="toggleFavorite(item.id)"
                        />
                    </v-card-actions>
                </v-card>

            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/stores/useStore';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const store = useStore();
const router = useRouter();
const projects = ref([]);
const mainTitle = ref('');

const fetchProjects = async () => {
    try {
        const response = await axios.get('https://sat7.faulio.com/api/v1/pageblocks/vod_main_page');
        mainTitle.value = response.data[2].title;
        
        projects.value = response.data[2].programsobjects;
        
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};

const toggleFavorite = (projectId: number) => {
if (store.isAuthenticated) {
        store.toggleFavorite(projectId);
    } else {
        alert('Please log in to add to favorites.');
    }
};

const isFavorite = (projectId: number) => {
    return store.favorites.includes(projectId);
};

const goToLogin = () => {
  router.push('/signin');
};

onMounted(() => {
    fetchProjects();
});

</script>

<style lang="scss">

</style>  