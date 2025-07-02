#!/usr/bin/env python3
"""
Task Manager Flask API
A RESTful API for managing tasks with full CRUD operations.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# In-memory storage (in production, use a proper database)
tasks = []

# Sample data
sample_tasks = [
    {
        "id": str(uuid.uuid4()),
        "title": "Design the new homepage",
        "description": "Create mockups and wireframes for the company homepage redesign",
        "status": "in-progress",
        "priority": "high",
        "created_at": "2025-01-01T10:00:00Z",
        "due_date": "2025-01-15T17:00:00Z"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Setup CI/CD pipeline",
        "description": "Configure automated testing and deployment pipeline",
        "status": "todo",
        "priority": "medium",
        "created_at": "2025-01-01T14:30:00Z",
        "due_date": "2025-01-20T12:00:00Z"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Write API documentation",
        "description": "Document all REST API endpoints with examples",
        "status": "completed",
        "priority": "low",
        "created_at": "2024-12-28T09:15:00Z",
        "due_date": "2025-01-05T16:00:00Z"
    }
]

# Initialize with sample data
tasks.extend(sample_tasks)

def create_response(data=None, message=None, status=200):
    """Create standardized API response"""
    response = {}
    if data is not None:
        response['data'] = data
    if message:
        response['message'] = message
    response['timestamp'] = datetime.utcnow().isoformat() + 'Z'
    return jsonify(response), status

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return create_response(
        data={"status": "healthy", "service": "task-manager-api"},
        message="Service is running"
    )

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks with optional filtering"""
    status_filter = request.args.get('status')
    priority_filter = request.args.get('priority')
    search_query = request.args.get('search', '').lower()
    
    filtered_tasks = tasks
    
    if status_filter:
        filtered_tasks = [t for t in filtered_tasks if t['status'] == status_filter]
    
    if priority_filter:
        filtered_tasks = [t for t in filtered_tasks if t['priority'] == priority_filter]
    
    if search_query:
        filtered_tasks = [
            t for t in filtered_tasks 
            if search_query in t['title'].lower() or search_query in t['description'].lower()
        ]
    
    return create_response(
        data=filtered_tasks,
        message=f"Retrieved {len(filtered_tasks)} tasks"
    )

@app.route('/api/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    """Get a specific task by ID"""
    task = next((t for t in tasks if t['id'] == task_id), None)
    
    if not task:
        return create_response(
            message="Task not found",
            status=404
        )
    
    return create_response(
        data=task,
        message="Task retrieved successfully"
    )

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description']
        for field in required_fields:
            if not data.get(field):
                return create_response(
                    message=f"Missing required field: {field}",
                    status=400
                )
        
        # Create new task
        new_task = {
            "id": str(uuid.uuid4()),
            "title": data['title'].strip(),
            "description": data['description'].strip(),
            "status": data.get('status', 'todo'),
            "priority": data.get('priority', 'medium'),
            "created_at": datetime.utcnow().isoformat() + 'Z',
            "due_date": data.get('due_date')
        }
        
        tasks.append(new_task)
        
        return create_response(
            data=new_task,
            message="Task created successfully",
            status=201
        )
        
    except Exception as e:
        return create_response(
            message=f"Error creating task: {str(e)}",
            status=500
        )

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    """Update an existing task"""
    try:
        task = next((t for t in tasks if t['id'] == task_id), None)
        
        if not task:
            return create_response(
                message="Task not found",
                status=404
            )
        
        data = request.get_json()
        
        # Update task fields
        updatable_fields = ['title', 'description', 'status', 'priority', 'due_date']
        for field in updatable_fields:
            if field in data:
                task[field] = data[field]
        
        task['updated_at'] = datetime.utcnow().isoformat() + 'Z'
        
        return create_response(
            data=task,
            message="Task updated successfully"
        )
        
    except Exception as e:
        return create_response(
            message=f"Error updating task: {str(e)}",
            status=500
        )

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    global tasks
    
    task = next((t for t in tasks if t['id'] == task_id), None)
    
    if not task:
        return create_response(
            message="Task not found",
            status=404
        )
    
    tasks = [t for t in tasks if t['id'] != task_id]
    
    return create_response(
        message="Task deleted successfully"
    )

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get task statistics"""
    stats = {
        "total": len(tasks),
        "by_status": {
            "todo": len([t for t in tasks if t['status'] == 'todo']),
            "in-progress": len([t for t in tasks if t['status'] == 'in-progress']),
            "completed": len([t for t in tasks if t['status'] == 'completed'])
        },
        "by_priority": {
            "low": len([t for t in tasks if t['priority'] == 'low']),
            "medium": len([t for t in tasks if t['priority'] == 'medium']),
            "high": len([t for t in tasks if t['priority'] == 'high'])
        }
    }
    
    return create_response(
        data=stats,
        message="Statistics retrieved successfully"
    )

@app.errorhandler(404)
def not_found(error):
    return create_response(
        message="Endpoint not found",
        status=404
    )

@app.errorhandler(500)
def internal_error(error):
    return create_response(
        message="Internal server error",
        status=500
    )

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"Starting Task Manager API on port {port}")
    print(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)