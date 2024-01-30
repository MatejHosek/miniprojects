# ---- SETTINGS ----
max_fps = 60
screen_size = (800, 800)
grid_size = (100, 100)
brush_radius = 3

# Palette from https://www.color-hex.com/color-palette/11392
snad_colors = ['#f6d7b0', '#f2d2a9', '#eccca2', '#e7c496', '#e1bf92'] 

import pygame
from random import choice
from math import sqrt

# Pygame setup
pygame.init()
screen = pygame.display.set_mode(screen_size)
clock = pygame.time.Clock()
running = True

# Sand setup
cellDimensions = (screen_size[0] // grid_size[0], screen_size[1] // grid_size[1])
grid = [ [None] * grid_size[1] for _ in range(grid_size[0]) ]

def isInBounds(coords: list, size: list) -> bool:
    if not hasattr(coords, '__iter__'):
        coords = [coords]

    if not hasattr(size, '__iter__'):
        size = [size]

    for i in range(len(coords)):
        if coords[i] < 0 or coords[i] > size[i] - 1:
            return False
        
    return True

while running:
    # Limit FPS, prevent sand from falling too fast
    clock.tick(max_fps)

    # Exit on user close
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
            break

    # Clear screen
    screen.fill('black')

    # Add or subtract grains around mouse when LMB is pressed
    if True in pygame.mouse.get_pressed():
        position = (pygame.mouse.get_pos()[0] // cellDimensions[0], pygame.mouse.get_pos()[1] // cellDimensions[1])

        for i in range(-brush_radius, brush_radius):
            if not isInBounds(i + position[1], grid_size[1]):
                continue
            
            for j in range(-brush_radius, brush_radius):
                if not isInBounds(j + position[0], grid_size[0]):
                    continue

                if sqrt(i*i + j*j) < brush_radius:
                    if pygame.mouse.get_pressed()[0] == True:
                        grid[i + position[1]][j + position[0]] = choice(snad_colors)
                        continue

                    if pygame.mouse.get_pressed()[2] == True:
                        grid[i + position[1]][j + position[0]] = None
    
    # Simulate grains of sand
    newGrid = [ [None] * grid_size[1] for _ in range(grid_size[0]) ]

    for i in range(grid_size[0]):
        for j in range(grid_size[1]):
            # Skip, if current grid space is empty
            if grid[i][j] == None:
                continue

            # Grains falling straight down
            if isInBounds(i + 1, grid_size[0]) and grid[i + 1][j] == None:
                newGrid[i + 1][j] = grid[i][j]
                continue

            # Grains falling to neighboring columns
            dir = choice([-1, 1])
            if isInBounds((i + 1, j + dir), grid_size) and grid[i + 1][j + dir] == None:
                newGrid[i + 1][j + dir] = grid[i][j]
                continue

            if isInBounds((i + 1, j - dir), grid_size) and grid[i + 1][j - dir] == None:
                newGrid[i + 1][j - dir] = grid[i][j]
                continue

            newGrid[i][j] = grid[i][j]

    grid = newGrid

    # Draw grains on screen
    for i in range(grid_size[0]):
        for j in range(grid_size[1]):
            if grid[i][j] != None:
                rect = pygame.Rect((j * cellDimensions[0], i * cellDimensions[1]), cellDimensions)
                pygame.draw.rect(screen, grid[i][j], rect)

    # Display image to screen
    pygame.display.flip()