ld a, (addr), 23606
ld a, (bc)
ld a, (de)
ld a, (hl)
ld a, (ix+5)
ld a, (iy+5)
ld a, a
ld a, b
ld a, c
ld a, d
ld a, e
ld a, h
ld a, i
ld a, l

#ld hl, 30000
#ld de, 16384
#ld bc, 6912
#ld a, (hl)
#ld (hl), a
ld (addr), a, 23606
#ld (ix + 5), a
#ld a, (addr), 23606
#ldir
#jp nz, 30000
#jr nz, -5
#jp 40000
#ret

ld (addr), a, 23606
ld (addr), bc, 23606
ld (addr), de, 23606
ld (addr), hl, 23606
ld (addr), ix, 23606
ld (addr), iy, 23606
ld (addr), sp, 23606
