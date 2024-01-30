import pygame
from random import random, choice

# ---- SETTINGS ----
max_fps = 15                # Controls max FPS, FPS influences simulation speed
screen_size = (800, 800)    # Controls screen size
grid_size = (20, 20)        # Controls sand grid size, for grains to be pixels set to screen_size

# Pygame setup
pygame.init()
screen = pygame.display.set_mode(screen_size)
clock = pygame.time.Clock()
running = True

# Sand setup
cellDimensions = (screen_size[0] / grid_size[0], screen_size[1] / grid_size[1])
grid = [ [None] * grid_size[1] for _ in range(grid_size[0]) ]

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

    # Simulate grains of sand
    newGrid = [ [None] * grid_size[1] for _ in range(grid_size[0]) ]

    for i in range(grid_size[0]):
        for j in range(grid_size[1]):
            # Skip, if current grid space is empty
            if grid[i][j] == None:
                continue

            # Grains falling straight down
            if i + 1 < grid_size[0] and grid[i + 1][j] == None:
                newGrid[i + 1][j] = grid[i][j]
                continue

            # Grains falling to neighboring columns
            dir = choice([-1, 1])
            if i + 1 < grid_size[0] and j + dir < grid_size[1] and j + dir >= 0 and grid[i + 1][j + dir] == None:
                newGrid[i + 1][j + dir] = grid[i][j]
                continue

            if i + 1 < grid_size[0] and j - dir < grid_size[1] and j - dir >= 0 and grid[i + 1][j - dir] == None:
                newGrid[i + 1][j - dir] = grid[i][j]
                continue

            newGrid[i][j] = grid[i][j]

    grid = newGrid

    # Draw grains on screen
    for i in range(grid_size[0]):
        for j in range(grid_size[1]):
            if grid[i][j] == True:
                rect = pygame.Rect((j * cellDimensions[0], i * cellDimensions[1]), cellDimensions)
                pygame.draw.rect(screen, 'white', rect)

    # Display image to screen
    pygame.display.flip()