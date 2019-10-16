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

import sys
import bpy
import random

from colorsys import rgb_to_hsv, hsv_to_rgb
import bmesh
from bpy.types import Operator
from bpy.props import ( FloatProperty, IntProperty,)
from math import pi
from mathutils import ( Quaternion, Vector,)
from bpy_extras.object_utils import ( AddObjectHelper, object_data_add,)

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

# TODO: random for now, but should push randomly "out"
def r( v ):
    return v + 0.3 * random.random()

def q( v ):
    return v

def zUp( v1, v2, a ):
    return (
          ( v1[ 0 ] + v2[ 0 ] ) / 2 + 0
        , ( v1[ 1 ] + v2[ 1 ] ) / 2 + 0
        , ( v1[ 2 ] + v2[ 2 ] ) / 2 + a
    )

# TODO: these must already exist somewhere...

def add( a, b ):
    return ( a[ 0 ] + b[ 0 ], a[ 1 ] + b[ 1 ], a[ 2 ] + b[ 2 ] )

def subtract( a, b ):
    return ( a[ 0 ] - b[ 0 ], a[ 1 ] - b[ 1 ], a[ 2 ] - b[ 2 ] )

def scale( a, f ):
    return ( a[ 0 ] * f, a[ 1 ] * f, a[ 2 ] * f )

def hissy( h, s, v ):
    x = hsv_to_rgb( h, s, v )
    return ( x[0], x[1], x[2], 1 )

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
        # set up the materials

        mat_house = bpy.data.materials.new( "mat_house" )
        haus.data.materials.append( mat_house )

        mat_roof = bpy.data.materials.new( "mat_roof" )
        haus.data.materials.append( mat_roof )

        hue = random.random()
        saturation = random.random()

        mat_house.diffuse_color = hissy( hue, saturation, 0.1 )
        mat_roof.diffuse_color  = hissy( hue, saturation, 0.5 )

        #################################
        # vertices and faces

        a = 1 + random.random() * 2
        b = 1 + random.random() * 1

        if random.random() < 0.1:
            tmp = a
            a = b
            b = tmp

        F = floor = [ 
              bm.verts.new( ( r(0), r(0), 0 ) ) #        0 ---- 1 back
            , bm.verts.new( ( r(b), r(0), 0 ) ) #        |      |
            , bm.verts.new( ( r(b), r(a), 0 ) ) # right> |      | <left
            , bm.verts.new( ( r(0), r(a), 0 ) ) #        3 ---- 2 front
        ]
        
        C = ceiling = [ 
              bm.verts.new( ( r(0), r(0), r(b) ) ) 
            , bm.verts.new( ( r(b), r(0), r(b) ) ) 
            , bm.verts.new( ( r(b), r(a), r(b) ) ) 
            , bm.verts.new( ( r(0), r(a), r(b) ) ) 
        ]

        roof_factor = ( 0.1 + 1.0 * random.random() )
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

        #################################
        # windows and frames

        #################################
        # chimney

        #################################
        # 
       
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
# EOF 
#############################################################################
