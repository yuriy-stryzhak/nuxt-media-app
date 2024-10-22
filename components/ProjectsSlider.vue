<template>

    <Swiper
        v-if="projects.length > 0"
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

                <v-divider
                    v-if="store.isAuthenticated"
                    class="mx-4 mb-1"
                />

                <v-card-actions
                    v-if="store.isAuthenticated"
                >
                    <v-btn
                        :color="isFavorite(item.id) ? 'red' : 'primary'"
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

    <v-container v-else>
        <v-row>
            <v-col
            v-for="n in 4"
            :key="n"
            cols="12"
            md="3"
            >
            <v-skeleton-loader
                class="mx-auto border"
                max-width="300"
                type="image, article"
            />
            </v-col>
        </v-row>
    </v-container>

</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { useStore } from '@/stores/useStore';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const props = defineProps({
    projects: {
        type: Array,
        required: true
    }
});

const store = useStore();

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

</script>

<style lang="scss">

</style>  