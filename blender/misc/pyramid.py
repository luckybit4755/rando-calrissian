#############################################################################
# This is a simple blender 2.8 add-on to create a pyramid mesh as an example

import bmesh
import bpy

from mathutils import ( Quaternion )

#############################################################################
# addon registration information

bl_info = {
    "name"        : "Pyramid Maker",
    "author"      : "valalalalalalalalalala",
    "version"     : (0,0,0),
    "blender"     : (2,80,0),
    "location"    : "View3D > Add > Mesh",
    "description" : "Create a simple pyramid",
    "warning"     : "",
    "wiki_url"    : "",
    "tracker_url" : "",
    "category"    : "Add Mesh"
}

#############################################################################
# class to implement the functionality

class Pyramid( bpy.types.Operator ):
    """Create a simple pyramid"""
    bl_idname = "mesh.simple_pyramid"
    bl_label = "Pyramid"
    bl_options = {'REGISTER', 'UNDO'}
        
    def execute(self, context):

        #################################
        # create the mesh and objects in the scene

        bm = bmesh.new()
        mesh = bpy.data.meshes.new( "PyramidMesh" )
        pyramid = bpy.data.objects.new( "Pyramid", mesh )

        context.collection.objects.link( pyramid )
        context.view_layer.objects.active = pyramid
        pyramid.select_set( True )

        pyramid.location = tuple(context.scene.cursor.location)
        pyramid.rotation_quaternion = [1.0, 0.0, 0.0, 0.0]

        #################################
        # simple materials
        # https://docs.blender.org/api/current/bpy.types.Material.html#bpy.types.Material
    
        material = bpy.data.materials.new( "red" )
        pyramid.data.materials.append( material ) # 0 material_index
        material.diffuse_color = ( 1, 0, 0, 1 )

        material = bpy.data.materials.new( "green" )
        pyramid.data.materials.append( material ) # 1 material_index
        material.diffuse_color = ( 0, 1, 0, 1 )
    
        material = bpy.data.materials.new( "blue" )
        pyramid.data.materials.append( material ) # 2 material_index
        material.diffuse_color = ( 0, 0, 1, 1 )
    
        material = bpy.data.materials.new( "yellow" )
        pyramid.data.materials.append( material ) # 3 material_index
        material.diffuse_color = ( 1, 1, 0, 1 )

        #################################
        # add some vertices
        # https://docs.blender.org/api/current/bmesh.types.html#bmesh.types.BMVert

        s2 = 1.414
        y = -s2 / 2
        base1 = bm.verts.new( ( -s2, -s2, 0.0 ) )
        base2 = bm.verts.new( ( +s2, -s2, 0.0 ) )
        base3 = bm.verts.new( ( 0.0, 1.0, 0.0 ) )
        top   = bm.verts.new( ( 0.0,   y, 2.0 ) )

        #################################
        # makes some faces and assign the materials
        # https://docs.blender.org/api/current/bmesh.types.html#bmesh.types.BMFace

        bm.faces.new( [ base3, base2, base1 ] ).material_index = 0
        bm.faces.new( [ base2, top, base1 ] ).material_index = 1
        bm.faces.new( [ base3, top, base2 ] ).material_index = 2
        bm.faces.new( [ base1, top, base3 ] ).material_index = 3

        # make the changes take affect and release resources

        bm.to_mesh( mesh )
        mesh.update()
        bm.free()
    
        return {'FINISHED'}

#############################################################################
# blender plumbing

def register():
    bpy.utils.register_class( Pyramid )
    bpy.types.VIEW3D_MT_mesh_add.append( menu_func )
    
def unregister():
    bpy.utils.unregister_class( Pyramid )
    bpy.types.VIEW3D_MT_mesh_add.remove( menu_func )

def menu_func(self, context):
    self.layout.operator( Pyramid.bl_idname, icon='MESH_CUBE' )

# the end!
#############################################################################
