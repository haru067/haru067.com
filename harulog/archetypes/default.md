---
author: "haru067"
title: "{{ replace .TranslationBaseName "-" " " | title }}"
date: {{ .Date }}
---

## Introduction

This tutorial will show you how to create a simple theme in Hugo. I assume that you are familiar with HTML, the bash command line, and that you are comfortable using Markdown to format content. I'll explain how Hugo uses templates and how you can organize your templates to create a theme. I won't cover using CSS to style your theme.