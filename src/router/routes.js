const routes = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      { path: "report", component: () => import("pages/report.vue") },
      { path: "map", component: () => import("pages/map.vue") },
      { path: "about", component: () => import("pages/about.vue") },
      { path: "test", component: () => import("pages/test.vue") },
    ]
  },
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
