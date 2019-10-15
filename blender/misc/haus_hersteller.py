#!/usr/bin/env python
#
# https://michelanders.nl/wp-content/uploads/2016/08/Creating-add-ons-for-Blender-Michel-J.-Anders-sample2.pdf
# file:///Applications/Blender.app/Contents/Resources/2.80/scripts/addons/add_mesh_extra_objects/__init__.py
# /Applications/Blender.app/Contents/Resources/2.80/scripts/addons/add_mesh_extra_objects/add_mesh_pyramid.py
# 

import sys
import bpy
import random

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

# TODO: random for now, but should push randomly "out"
def r( v ):
    return v + 0.2 * random.random()

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

class HausHersteller( bpy.types.Operator ):
    """Create a silly little house"""
    bl_idname = "mesh.silly_house"
    bl_label = "Silly Little House AAA" 
    bl_options = {'REGISTER', 'UNDO'}
        
    def execute(self, context):
        a = 2
        b = 1

        bm = bmesh.new()

        F = floor = [ 
              bm.verts.new( ( q(0), q(0), 0 ) ) #        0 ---- 1 back
            , bm.verts.new( ( q(b), q(0), 0 ) ) #        |      |
            , bm.verts.new( ( q(b), q(a), 0 ) ) # right> |      | <left
            , bm.verts.new( ( q(0), q(a), 0 ) ) #        3 ---- 2 front
        ]
        
        C = ceiling = [ 
              bm.verts.new( ( r(0), r(0), r(b) ) ) 
            , bm.verts.new( ( r(b), r(0), r(b) ) ) 
            , bm.verts.new( ( r(b), r(a), r(b) ) ) 
            , bm.verts.new( ( r(0), r(a), r(b) ) ) 
        ]

        roof_height = ( 0.5 + 0.2 * random.random() ) * b;

        apex_back  = bm.verts.new( zUp( C[0].co, C[1].co, roof_height ) )
        apex_front = bm.verts.new( zUp( C[2].co, C[3].co, roof_height ) )

        # core of the house

        bm.faces.new( [ F[0], F[1], C[1], C[0] ] ) # back wall
        bm.faces.new( [ F[2], F[3], C[3], C[2] ] ) # front wall

        bm.faces.new( [ F[3], F[0], C[0], C[3] ] ) # right wall
        bm.faces.new( [ F[1], F[2], C[2], C[1] ] ) # left wall

        bm.faces.new( [ C[0], C[1], apex_back  ] )  # back apex
        bm.faces.new( [ C[2], C[3], apex_front ] )  # back apex

        # roof of the house

        out = 0.2
        up  = 0.2
        length = 1.2

        # front and back of the roof

        roof_front_left  = self.roofin( bm, out, up, length, C[2], apex_front, True )
        roof_front_right = self.roofin( bm, out, up, length, C[3], apex_front, False )

        roof_back_left  = self.roofin( bm, -out, up, length, C[1], apex_back, False )
        roof_back_right = self.roofin( bm, -out, up, length, C[0], apex_back, True  )

        # top of the roof

        rf = roof_front_left # forward
        rb = roof_back_left  # backwards
        bm.faces.new( [ rf[1], rb[2], rb[1], rf[2] ] ) # top left

        rf = roof_front_right # backwards
        rb = roof_back_right  # forward
        bm.faces.new( [ rf[1], rb[2], rb[1], rf[2] ] ) # top right

        # outside of the roof

        rf = roof_front_left # forward
        rb = roof_back_left  # backwards
        bm.faces.new( [ rb[1], rb[0], rf[3], rf[2] ] ) # outside left
       
        rf = roof_front_right # backwards
        rb = roof_back_right  # forward
        bm.faces.new( [ rf[1], rf[0], rb[3], rb[2] ] ) # outside right
                

        # eaves of the side of the roof

        

        #################################
        # add the object and mesh

        mesh = bpy.data.meshes.new( "SillyHouseMesh" )
        bm.to_mesh( mesh )
        mesh.update()
        #res = object_data_add( context, mesh, operator=self )

        # Wallfactory.py (line 873)
        haus = bpy.data.objects.new( "SillyHouseObj", mesh )
        context.collection.objects.link( haus )
        context.view_layer.objects.active = haus
        haus.select_set( True )

        haus.location = tuple(context.scene.cursor.location)
        haus.rotation_quaternion = [1.0, 0.0, 0.0, 0.0]

        return {'FINISHED'}
    
    def roofin( self, bm, out, up, length, wall, apex, forward ):
        roof_slope = scale( subtract( wall.co, apex.co ), length )

        roof_out         = bm.verts.new( add( apex.co,        ( 0, out, 0 ) ) )
        roof_out_up      = bm.verts.new( add( roof_out.co,    ( 0, 0, up ) ) )
        roof_out_side    = bm.verts.new( add( roof_out.co,    roof_slope ) )
        roof_out_side_up = bm.verts.new( add( roof_out_up.co, roof_slope ) )

        # front / back of roof...
        bits = [ roof_out, roof_out_up, roof_out_side_up, roof_out_side ]
        if not forward: 
            bits.reverse()
        bm.faces.new( bits )

        # roof underhang
        underhang = [ roof_out_side, wall, apex, roof_out ]
        if not forward:
            underhang.reverse()
        bm.faces.new( underhang )

        return bits

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
