// utils.js - 공통 유틸 함수

export function loadComponent(selector, path) {
  return fetch(path)
    .then(res => res.text())
    .then(html => {
      document.querySelector(selector).innerHTML = html;
    })
    .catch(error => {
      console.error(`Component loading error for ${path}:`, error);
      throw error;
    });
}