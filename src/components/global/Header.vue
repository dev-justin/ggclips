<template>
  <Disclosure as="nav" class="bg-black" v-slot="{ open }">
    <div class="px-2 sm:px-4 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex items-center px-2 lg:px-0">
          <div class="flex-shrink-0">
            <router-link :to="{ name: 'home' }">
              <LogoSvg class="h-8 w-8 fill-purple-700" />
            </router-link>
          </div>
          <div class="hidden lg:ml-6 lg:block">
            <div class="flex space-x-4">
              <template v-for="{ name, to, needsAuth } in navigation">
                <router-link
                  v-if="(needsAuth && userLoggedIn) || !needsAuth"
                  :key="name"
                  :to="to"
                  class="rounded-md px-3 py-2 text-sm font-medium text-white transition-all duration-150 ease-in-out hover:bg-purple-700"
                  >{{ name }}
                </router-link>
              </template>
              <template v-if="!userLoggedIn">
                <button
                  type="button"
                  class="rounded-md px-3 py-2 text-sm font-medium text-white transition-all duration-150 ease-in-out hover:bg-purple-700"
                  @click.prevent="modal.modalType('login')"
                >
                  Login
                </button>
                <button
                  type="button"
                  class="rounded-md px-3 py-2 text-sm font-medium text-white transition-all duration-150 ease-in-out hover:bg-purple-700"
                  @click.prevent="modal.modalType('signup')"
                >
                  Sign up
                </button>
              </template>
            </div>
          </div>
        </div>
        <div class="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
          <div class="w-full max-w-lg lg:max-w-xs">
            <label for="search" class="sr-only">Search</label>
            <div class="relative">
              <div
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <MagnifyingGlassIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                name="search"
                class="block w-full rounded-md border-none bg-zinc-800 py-2 pl-10 pr-3 leading-5 placeholder-zinc-400 focus:text-white focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div>
        <div class="flex lg:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon
              v-if="!open"
              class="block h-6 w-6 text-purple-700"
              aria-hidden="true"
            />
            <XMarkIcon
              v-else
              class="block h-6 w-6 text-purple-700"
              aria-hidden="true"
            />
          </DisclosureButton>
        </div>
        <div class="hidden lg:ml-4 lg:block" v-if="userLoggedIn">
          <div class="flex items-center">
            <!-- Profile dropdown -->
            <Menu as="div" class="relative flex-shrink-0">
              <div>
                <MenuButton
                  class="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span class="sr-only">Open user menu</span>
                  <img
                    class="h-8 w-8 rounded-full"
                    :src="userStore.avatar"
                    alt=""
                  />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  ><MenuItem>
                    <router-link
                      :to="{ name: 'profile' }"
                      class="block px-4 py-2 text-sm text-gray-700 hover:text-purple-700 bg-transparent"
                    >
                      Profile
                    </router-link>
                  </MenuItem>
                  <MenuItem>
                    <a
                      @click.prevent="userStore.logout"
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:text-purple-700"
                      >Sign out</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>

    <DisclosurePanel class="lg:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <router-link
          v-for="{ name, to } in navigation"
          :key="name"
          :to="to"
          class="rounded-md px-3 py-2 text-sm font-medium text-white transition-all duration-150 ease-in-out hover:bg-purple-700 block"
          >{{ name }}
        </router-link>
      </div>
      <div class="border-t border-gray-700 pb-3">
        <div class="mt-3 space-y-1 px-2">
          <DisclosureButton
            as="a"
            href="#"
            class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-purple-700 transition-all duration-150 ease-in-out"
            >Sign out</DisclosureButton
          >
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import LogoSvg from "@/components/icons/LogoSvg.vue";
import { useModalStore } from "@/stores/modal";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { userLoggedIn } = storeToRefs(userStore);
const modal = useModalStore();

const navigation = [
  { name: "Home", to: { name: "home" }, needsAuth: false },
  { name: "Following", to: { name: "following" }, needsAuth: true },
  { name: "Profile", to: { name: "profile" }, needsAuth: true },
];
</script>
