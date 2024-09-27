using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dataAccess;
using dataAccess.Models;

namespace api
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaperController : ControllerBase
    {
        private readonly PaperContext _context;

        public PaperController(PaperContext context)
        {
            _context = context;
        }

        // GET: api/Paper
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Paper>>> GetPapers()
        {
            return await _context.Papers.ToListAsync();
        }

        // GET: api/Paper/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Paper>> GetPaper(int id)
        {
            var paper = await _context.Papers.FindAsync(id);

            if (paper == null)
            {
                return NotFound();
            }

            return paper;
        }

        // PUT: api/Paper/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaper(int id, Paper paper)
        {
            if (id != paper.Id)
            {
                return BadRequest();
            }

            _context.Entry(paper).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaperExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Paper
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Paper>> PostPaper(Paper paper)
        {
            _context.Papers.Add(paper);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaper", new { id = paper.Id }, paper);
        }

        // DELETE: api/Paper/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaper(int id)
        {
            var paper = await _context.Papers.FindAsync(id);
            if (paper == null)
            {
                return NotFound();
            }

            _context.Papers.Remove(paper);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaperExists(int id)
        {
            return _context.Papers.Any(e => e.Id == id);
        }
    }
}
