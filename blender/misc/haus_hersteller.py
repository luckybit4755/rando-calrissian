#!/usr/bin/env python
#
# https://michelanders.nl/wp-content/uploads/2016/08/Creating-add-ons-for-Blender-Michel-J.-Anders-sample2.pdf
# file:///Applications/Blender.app/Contents/Resources/2.80/scripts/addons/add_mesh_extra_objects/__init__.py
# 

import sys
import bpy

# /Applications/Blender.app/Contents/Resources/2.80/scripts/addons/add_mesh_extra_objects/add_mesh_pyramid.py
import bmesh
from bpy.types import Operator
from bpy.props import ( FloatProperty, IntProperty,)
from math import pi
from mathutils import ( Quaternion, Vector,)
from bpy_extras.object_utils import ( AddObjectHelper, object_data_add,)

bl_info = {
    "name"        : "Haus Hersteller",
    "author"      : "Valerie Hammond",
    "version"     : (0,0,0),
    "blender"     : (2,80,0),
    "location"    : "View3D > Add > Mesh",
    "description" : "Create a silly little house",
    "warning"     : "",
    "wiki_url"    : "",
    "tracker_url" : "",
    "category"    : "Add Mesh"
}

class HausHersteller( bpy.types.Operator ):
    """Create a silly little house"""
    bl_idname = "mesh.silly_house"
    bl_label = "Silly Little House AAC" 
    bl_options = {'REGISTER', 'UNDO'}
        
    def execute(self, context):
        # context.active_object.location.x += 1

        bm = bmesh.new()
        bm.verts.new( (0,0,0) )
        bm.verts.new( (0,1,0) )
        bm.verts.new( (0,1,1) )

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
