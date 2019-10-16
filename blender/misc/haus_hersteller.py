#!/usr/bin/env python
#
# https://michelanders.nl/wp-content/uploads/2016/08/Creating-add-ons-for-Blender-Michel-J.-Anders-sample2.pdf
# file:///Applications/Blender.app/Contents/Resources/2.80/scripts/addons/add_mesh_extra_objects/__init__.py
# /Applications/Blender.app/Contents/Resources/2.80/scripts/addons/add_mesh_extra_objects/add_mesh_pyramid.py
#
# https://docs.blender.org/api/current/bmesh.types.html#bmesh.types.BMFace
# https://docs.blender.org/api/current/bmesh.types.html#bmesh.types.BMVert
# https://docs.blender.org/api/current/bpy.types.Material.html#bpy.types.Material
#
# https://blender.stackexchange.com/questions/154635/how-to-create-a-new-material-and-set-it-has-active-material-using-python-script/154717
#
# IDK: https://blender.stackexchange.com/questions/65359/how-to-create-and-extrude-a-bmesh-face
#
#

import bmesh
import bpy
import random
import sys

from bpy.props import ( FloatProperty, IntProperty,)
from bpy.types import Operator
from bpy_extras.object_utils import ( AddObjectHelper, object_data_add )
from colorsys import rgb_to_hsv, hsv_to_rgb
from math import pi, sqrt
from mathutils import ( Quaternion, Vector)

bl_info = {
    "name"        : "Haus Hersteller",
    "author"      : "Valerie Grafin von Mainberg",
    "version"     : (0,0,0),
    "blender"     : (2,80,0),
    "location"    : "View3D > Add > Mesh",
    "description" : "Create a silly little house",
    "warning"     : "",
    "wiki_url"    : "",
    "tracker_url" : "",
    "category"    : "Add Mesh"
}

MATERIAL_HOUSE   = 0
MATERIAL_ROOF    = 1
MATERIAL_FRAME   = 2
MATERIAL_DOOR    = 3
MATERIAL_WINDOW  = 4
MATERIAL_CHIMNEY = 5

###

class HausHersteller( bpy.types.Operator ):
    """Create a silly little house"""
    bl_idname = "mesh.silly_house"
    bl_label = "Silly Little House" 
    bl_options = {'REGISTER', 'UNDO'}
        
    def execute(self, context):
        #################################
        # plumbing to create mesh and object 

        bm = bmesh.new()

        mesh = bpy.data.meshes.new( "SillyHouseMesh" )
 
        haus = bpy.data.objects.new( "SillyHouse", mesh )
        context.collection.objects.link( haus )
        context.view_layer.objects.active = haus
        haus.select_set( True )

        haus.location = tuple(context.scene.cursor.location)
        haus.rotation_quaternion = [1.0, 0.0, 0.0, 0.0]

        #################################
        # generate the materials (needs work)

        hue = random.random()
        saturation = random.random()
        value = 0.1

        for part in "house roof frame door window chimney".split( " " ):
            material_name = "mat_" + part
            material = bpy.data.materials.new( material_name )
            haus.data.materials.append( material )
            material.diffuse_color = hissy( hue, saturation, value )
            value += 0.1
            saturation = clump( saturation + 0.05 * random.random() - 0.05 * random.random() )

        #################################
        # vertices and faces

        a = 1.5 + random.random() * 1.0
        b = 1.0 + random.random() * 0.5

        # life is easier if the sides are all coplanar...

        q = 0.1 - random.random() * 0.2
        F = floor = [ 
              ( 0-q, 0-q, 0 ) #        0 ---- 1 back
            , ( b+q, 0-q, 0 ) #        |      |
            , ( b+q, a+q, 0 ) # right> |      | <left
            , ( 0-q, a+q, 0 ) #        3 ---- 2 front
        ]
        F = floor = self.vertexIt( bm, F )
        
        q = 0.1 - random.random() * 0.4
        C = ceiling = [ 
              ( 0-q, 0-q, b ) 
            , ( b+q, 0-q, b ) 
            , ( b+q, a+q, b ) 
            , ( 0-q, a+q, b ) 
        ]

        # might lean a bit... 
        if random.random() < 0.33:
            xlean = 0.1 - random.random() * 0.2
            ylean = 0.1 - random.random() * 0.2
            index = 0
            for coordinate in C:
                C[ index ] = ( coordinate[0] + xlean, coordinate[1] + ylean, coordinate[2] )
                index = index + 1 # python is neat

        C = ceiling = self.vertexIt( bm, C );

        roof_factor = ( 0.44 + 0.44 * random.random() )
        roof_height = roof_factor * b;

        apex_back  = bm.verts.new( zUp( C[0].co, C[1].co, roof_height ) )
        apex_front = bm.verts.new( zUp( C[2].co, C[3].co, roof_height ) )

        # core of the house

        bm.faces.new( [ F[0], F[1], C[1], C[0] ] ).material_index = MATERIAL_HOUSE # back wall
        bm.faces.new( [ F[2], F[3], C[3], C[2] ] ).material_index = MATERIAL_HOUSE # front wall

        bm.faces.new( [ F[3], F[0], C[0], C[3] ] ).material_index = MATERIAL_HOUSE # right wall
        bm.faces.new( [ F[1], F[2], C[2], C[1] ] ).material_index = MATERIAL_HOUSE # left wall

        bm.faces.new( [ C[0], C[1], apex_back  ] ).material_index = MATERIAL_HOUSE  # back apex
        bm.faces.new( [ C[2], C[3], apex_front ] ).material_index = MATERIAL_HOUSE  # back apex

        # roof of the house

        upness = roof_factor - 1 # base thickness on the height of the apex
        if upness < 0:
            upness = 0.1

        out    = 0.2 + random.random() * 0.3    # how far forward / back is the roof
        up     = 0.2 + random.random() * upness # how thick is the roof
        length = 1.2 + random.random() * 0.3    # length along the side

        #################################
        # left side of roof

        roof_front_left = self.roofOut( bm, out, up, length, C[2], apex_front, True )
        roof_back_left = self.roofOut( bm, -out, up, length, C[1], apex_back, False )
        roof_top_left = self.roofSide( bm, roof_front_left, roof_back_left, C[1], C[2], True )

        #################################
        # right side of roof

        roof_front_right = self.roofOut( bm, out, up, length, C[3], apex_front, False )
        roof_back_right = self.roofOut( bm, -out, up, length, C[0], apex_back, True  )
        roof_top_right = self.roofSide( bm, roof_front_right, roof_back_right, C[0], C[3], False )

        #################################
        # door and frame

        self.doorMan( bm, C, F )

        #################################
        # windows and frames
        # TODO

        #################################
        # chimney
        # TODO

        #################################
        # make it so!
       
        bm.to_mesh( mesh ) 
        mesh.update()

        return {'FINISHED'}
    
    def roofOut( self, bm, out, up, length, wall, apex, forward ):
        result = { "faces":[] }

        roof         = bm.verts.new( add( apex.co,    ( 0, out, 0 ) ) )
        roof_up      = bm.verts.new( add( roof.co,    ( 0, 0, up ) ) )

        out    += random.random() * 0.05
        up     += random.random() * 0.05

        length += random.random() * 0.05
        length2 = length * 1.2  # want the top to be a bit further out than the bottom...

        roof_slope1 = scale( subtract( wall.co, apex.co ), length )
        roof_slope2 = scale( subtract( wall.co, apex.co ), length2 )

        roof_side    = bm.verts.new( add( roof.co,    roof_slope1 ) )
        roof_side_up = bm.verts.new( add( roof_up.co, roof_slope2 ) )

        result[ "vertices" ] = [ roof, roof_up, roof_side_up, roof_side ]

        # front / back of roof...
        bits = result[ "vertices" ].copy()
        if not forward: 
            bits.reverse()

        out_face = bm.faces.new( bits )
        out_face.material_index = MATERIAL_ROOF
        result[ "faces" ].append( out_face )

        # roof underhang
        underhang = [ roof_side, wall, apex, roof ]
        if not forward:
            underhang.reverse()
        underhang_face = bm.faces.new( underhang )
        underhang_face.material_index = MATERIAL_ROOF
        result[ "faces" ].append( underhang_face )

        return result

    def roofSide( self, bm, roof_front, roof_back, c1, c2, reverse ):
        rf = roof_front[ "vertices" ]
        rb = roof_back[ "vertices" ]

        top = [ rf[2], rb[2], rb[1], rf[1] ]
        out = [ rb[2], rb[3], rf[3], rf[2] ]
        eve = [ rb[3],    c1,    c2, rf[3] ]

        if reverse:
            top.reverse()
        else:
            out.reverse()
            eve.reverse()

        top_face = bm.faces.new( top ) # top of roof
        out_face = bm.faces.new( out ) # outside of roof
        eve_face = bm.faces.new( eve ) # side eaves left
        top_face.material_index = out_face.material_index = eve_face.material_index = MATERIAL_ROOF
        
        return {"faces":[ top_face, out_face, eve_face ] }

    def doorMan( self, bm, C, F ):
        # IN-PROGRESS
       
        #                r2     r3
        # right> C[3] .---.-----.---. C[2] <left
        #             |   |     |   |
        #             |   |     |   |
        #             | q2+-----+q3 |
        #             |   |     |   |
        #             |   |     |   |
        #             |   |     |   |
        #             |   |     |   |
        # right> F[3] .___._____.___. F[2] <left
        #                 r1    r0
        # note: cuz of the wiggles, the surface may not be coplanar! oopsie...

        # how wide the doors are (bigger min means smaller door..., keep it under 0.5 )
        min = 0.30
        max = 1.0 - min
        rnd = min * 0.25

        front_floor_diff   = subtract( F[3].co, F[2].co ) # from 2 to 3
        front_ceiling_diff = subtract( C[3].co, C[2].co ) # from 2 to 3 

        r0 = add( F[2].co, scale( front_floor_diff,   p( min,  rnd ) ) ) # close to F[2]
        r1 = add( F[2].co, scale( front_floor_diff,   p( max, -rnd ) ) ) # close to F[3]
        r2 = add( C[2].co, scale( front_ceiling_diff, p( max, -rnd ) ) ) # close to C[3]
        r3 = add( C[2].co, scale( front_ceiling_diff, p( min,  rnd ) ) ) # close to C[2]
   
        outness = crossing( C[2].co,  C[3].co, F[3].co )
        fronting = scale( outness, 0.0133 )
        d0 = add( r0, fronting )
        d1 = add( r1, fronting )
        d2 = add( r2, fronting )
        d3 = add( r3, fronting ) 

        # how high up the doors come...
        fq2 = 0.5 + 0.1 * random.random()
        fq3 = 0.5 + 0.1 * random.random()
        q2 = add( d1, scale( subtract( d2, d1 ), fq2 ) )  
        q3 = add( d0, scale( subtract( d3, d0 ), fq3 ) )

        self.faceIt( bm, [d0,d1,q2,q3], MATERIAL_DOOR )

        # pull back to front of house

        # fq0 and fq1 for window frames at some point
        fq0 = 0
        fq1 = 0
        q0 = add( r0, scale( subtract( r3, r0 ), fq0 ) )
        q1 = add( r1, scale( subtract( r2, r1 ), fq1 ) )
        q2 = add( r1, scale( subtract( r2, r1 ), fq2 ) )  
        q3 = add( r0, scale( subtract( r3, r0 ), fq3 ) )

        #            f2                  q2_up_out .---. q2_up ---------- q3_up .---. q3_up_out
        #        q2.-----.q3                       |   |         g2->           |   |
        #          |     |                  q2_out .---. q2 ---------------  q3 .---. q3_out
        #       f1 |     | f3        -->           |   |         f2->           |   |
        #          |     |                         |   |  ^                     |   |
        #          |     |                         |   | f1                  f3 |   |
        # right> q1._____.q0  <left                |   |                     v  |   |
        #            f0                            |   |       <-f0             |   |
        #                                   q1_out .---. q1 ---------------- q0 .---. q0_out
        #                                          |   |       <-g0             |   |
        #                                q1_dn_out .---. q1_dn ---------- q0_dn .---. q0_dn_out
        #                                
        #                               note: the dn stuff is for window frames not door frames
        #                                

        f0 = subtract( q1, q0 )
        f1 = subtract( q2, q1 )
        f2 = subtract( q3, q2 )
        f3 = subtract( q0, q3 )

        outF = 0.133

        q0_out = add( q0, scale( f0, 0 - outF ) )
        q1_out = add( q0, scale( f0, 1 + outF ) )
        q2_out = add( q2, scale( f2, 0 - outF ) ) 
        q3_out = add( q2, scale( f2, 1 + outF ) )
        if False:
            self.faceIt( bm, [ q0_out, q1_out, q2_out, q3_out ], MATERIAL_FRAME )

        q1_dn      = add( q1, scale( f1, 0 - outF ) ) # f1: q1 to q2
        q2_up      = add( q1, scale( f1, 1 + outF ) )
        q3_up      = add( q3, scale( f3, 0 - outF ) ) # f3: q3 to q0
        q0_dn      = add( q3, scale( f3, 1 + outF ) ) 
        if False:
            self.faceIt( bm, [ q0_dn, q1_dn, q2_up, q3_up ], MATERIAL_FRAME )

        g0 = subtract( q1_dn, q0_dn )
        g2 = subtract( q3_up, q2_up )

        q0_dn_out  = add( q0_dn, scale( g0,  0 - outF ) )
        q1_dn_out  = add( q0_dn, scale( g0,  1 + outF ) )
        q2_up_out  = add( q2_up, scale( g2,  0 - outF ) )
        q3_up_out  = add( q2_up, scale( g2,  1 + outF ) )
        if False:
            self.faceIt( bm, [ q0_dn_out, q1_dn_out, q2_up_out, q3_up_out ], MATERIAL_FRAME );

        outness = scale( outness, 0.1 ) # idk...
        self.boxOut( bm, outness, [ q3_out, q2_out, q2_up_out, q3_up_out ], MATERIAL_FRAME ) # top
        if True:
            self.boxOut( bm, outness, [ q1, q1_out, q2_out, q2 ], MATERIAL_FRAME ) # right
            self.boxOut( bm, outness, [ q0_out, q0, q3, q3_out ], MATERIAL_FRAME ) # left
        else:
            this_would_be_for_windows = 'TODO'
        

    # 2 3 
    # 1 0
    def boxOut( self, bm, outness, coordinates, material_index ):
        outs = []
        for coordinate in coordinates:
            outs.append( add( coordinate, outness ) )
        c = coordinates
        o = outs

        # FIXME: this is pretty lazy adds a bunch of hidden faces and duplicate vertices...
        self.faceIt( bm, outs, material_index ) # front

        self.faceIt( bm, [ o[3], o[2], c[2], c[3] ], material_index ) # top
        self.faceIt( bm, [ c[0], o[0], o[3], c[3] ], material_index ) # left
        self.faceIt( bm, [ c[1], o[1], o[0], c[0] ], material_index ) # bottom
        self.faceIt( bm, [ c[1], c[2], o[2], o[1] ], material_index ) # right

    def vertexIt( self, bm, coordinates ):
        vertices = []
        for coordinate in coordinates:
            vertices.append( bm.verts.new( coordinate ) )
        return vertices

    def faceIt( self, bm, coordinates, material_index ):
        vertices = self.vertexIt( bm, coordinates )
        bm.faces.new( vertices ).material_index = material_index




#############################################################################

def register():
    bpy.utils.register_class( HausHersteller )
    bpy.types.VIEW3D_MT_mesh_add.append( menu_func )
    
def unregister():
    bpy.utils.unregister_class( HausHersteller )
    bpy.types.VIEW3D_MT_mesh_add.remove( menu_func )

def menu_func(self, context):
    self.layout.operator( HausHersteller.bl_idname, icon='MESH_CUBE' )

#############################################################################

if __name__ == "__main__":
    register()

#############################################################################
# random nonsense
#############################################################################

# plus-or-minus
def pm( v, r ):
    return v + r * random.random() - r * random.random()

def p( v, r ):
    return v + r * random.random();

# TODO: random for now, but should push randomly "out"
def r( v ):
    return p( v, 0.3 )

def clump( v ):
    while v < 0:
        v = v + 1
    while v > 1:
        v = v - 1
    return v

def q( v ):
    return v

def zUp( v1, v2, a ):
    return (
          ( v1[ 0 ] + v2[ 0 ] ) / 2 + 0
        , ( v1[ 1 ] + v2[ 1 ] ) / 2 + 0
        , ( v1[ 2 ] + v2[ 2 ] ) / 2 + a
    )

def hissy( h, s, v ):
    x = hsv_to_rgb( h, s, v )
    return ( x[0], x[1], x[2], 1 )

# TODO: these must already exist somewhere...

def add( a, b ):
    return ( a[ 0 ] + b[ 0 ], a[ 1 ] + b[ 1 ], a[ 2 ] + b[ 2 ] )

def subtract( a, b ):
    return ( a[ 0 ] - b[ 0 ], a[ 1 ] - b[ 1 ], a[ 2 ] - b[ 2 ] )

def scale( a, f ):
    return ( a[ 0 ] * f, a[ 1 ] * f, a[ 2 ] * f )

def crossing( a, b, c ):
    ab = normalize( subtract( a, b ) ) # b to a
    bc = normalize( subtract( c, b ) ) # b to c
    return cross( ab, bc )

def cross( a, b ):
   return ( 
          a[ 1 ] * b[ 2 ] - a[ 2 ] * b[ 1 ] # xyzzy
        , a[ 2 ] * b[ 0 ] - a[ 0 ] * b[ 2 ]
        , a[ 0 ] * b[ 1 ] - a[ 1 ] * b[ 0 ] 
    )

def normalize( a ):
    len = sqrt( a[ 0 ] * a[ 0 ] + a[ 1 ] * a[ 2 ] + a[ 2 ] * a[ 2 ] )
    if 0 == len:
        return a
    return ( a[ 0 ] / len, a[ 1 ] / len, a[ 2 ] / len )



#############################################################################
# EOF 
#############################################################################
