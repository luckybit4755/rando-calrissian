#!/usr/bin/env python
#
# https://michelanders.nl/wp-content/uploads/2016/08/Creating-add-ons-for-Blender-Michel-J.-Anders-sample2.pdf
# file:///Applications/Blender.app/Contents/Resources/2.80/scripts/addons/add_mesh_extra_objects/__init__.py
# 

import sys
import bpy

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
    bl_label = "Silly Little House"
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context):
        context.active_object.location.x += 1
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
